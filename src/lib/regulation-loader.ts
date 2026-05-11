// CosmetCheck Regulation Loader
// Loads rules from JSON files in src/data/regulations/

// Types for JSON rule files
export interface RegulationRule {
  ruleId: string
  category: 'banned' | 'restricted' | 'claim' | 'label' | 'ingredient' | 'packaging'
  target: string
  aliases?: string[]
  cas?: string
  severity: 'critical' | 'warning' | 'info'
  condition: string
  message: string
  sourceUrl?: string
  rootFamily?: string  // 成分族词根，用于归一匹配
}

export interface RegulationFile {
  source: string
  documentId: string
  version: string
  description: string
  rules: RegulationRule[]
}

// ── Root Clusters 词根簇 ──
export interface RootCluster {
  groupId: string
  label: string
  terms: string[]
}

export interface RootClustersFile {
  version: string
  description: string
  clusters: RootCluster[]
}

// 缓存 term -> groupId 映射
let rootClusterMap: Map<string, string> | null = null

export async function loadRootClusters(): Promise<Map<string, string>> {
  if (rootClusterMap) return rootClusterMap

  rootClusterMap = new Map<string, string>()
  try {
    const data = (await import('../data/regulations/root-clusters.json')) as unknown as RootClustersFile
    for (const cluster of data.clusters) {
      for (const term of cluster.terms) {
        rootClusterMap.set(term.toLowerCase(), cluster.groupId)
      }
    }
    console.log(`[RegulationLoader] Loaded ${data.clusters.length} root clusters, ${rootClusterMap.size} terms`)
  } catch (error) {
    console.warn('[RegulationLoader] Failed to load root clusters:', error)
  }
  return rootClusterMap
}

export function getTermGroupId(term: string): string | undefined {
  return rootClusterMap?.get(term.toLowerCase())
}

// Convert JSON rule format to engine Violation format
function convertRuleToViolation(
  rule: RegulationRule,
  country: 'BR' | 'MX'
): Omit<import('./engine').Violation, 'matchedText' | 'position'> {
  // Map category to ruleType
  let ruleType: 'prohibited' | 'restricted' | 'required' = 'prohibited'
  let category: 'ingredient' | 'label' | 'claim' | 'packaging' = 'ingredient'

  switch (rule.category) {
    case 'banned':
    case 'ingredient':
      ruleType = 'prohibited'
      category = 'ingredient'
      break
    case 'restricted':
      ruleType = 'restricted'
      category = 'ingredient'
      break
    case 'claim':
      ruleType = 'prohibited'
      category = 'claim'
      break
    case 'label':
    case 'packaging':
      ruleType = 'required'
      category = rule.category === 'label' ? 'label' : 'packaging'
      break
  }

  const source = country === 'BR' ? 'ANVISA' : 'COFEPRIS'

  return {
    ruleId: rule.ruleId,
    category,
    ruleType,
    keyword: rule.target,
    severity: rule.severity,
    message: `${rule.message} (${rule.condition})`,
    suggestion: `Check ${rule.category} ingredient/claim as per ${source} regulations.`,
    source: `${source} ${rule.sourceUrl ? `- ${rule.sourceUrl}` : ''}`,
    casNumber: rule.cas,
    aliases: rule.aliases,
    rootFamily: (rule as unknown as { rootFamily?: string }).rootFamily,
  }
}

// Dynamic imports for JSON files - will be loaded at runtime
const regulationFiles: {
  BR: Record<string, () => Promise<unknown>>
  MX: Record<string, () => Promise<unknown>>
} = {
  BR: {
    banned: () => import('../data/regulations/brazil/banned.json'),
    restricted: () => import('../data/regulations/brazil/restricted.json'),
    claims: () => import('../data/regulations/brazil/claims.json'),
    label: () => import('../data/regulations/brazil/label.json'),
    registration: () => import('../data/regulations/brazil/registration.json'),
  },
  MX: {
    banned: () => import('../data/regulations/mexico/banned.json'),
    claims: () => import('../data/regulations/mexico/claims.json'),
    label: () => import('../data/regulations/mexico/label.json'),
  },
}

export type LoadedRules = ReturnType<typeof convertRuleToViolation>

// Cache for loaded rules
let rulesCache: {
  BR: LoadedRules[]
  MX: LoadedRules[]
  loadedAt?: number
} | null = null

const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export async function loadRegulationRules(country: 'BR' | 'MX'): Promise<LoadedRules[]> {
  // Check cache
  if (rulesCache && rulesCache.loadedAt && Date.now() - rulesCache.loadedAt < CACHE_TTL) {
    return rulesCache[country]
  }

  const rules: LoadedRules[] = []
  const files = regulationFiles[country]

  try {
    // Load banned/restricted ingredients
    if (files.banned) {
      const banned = await files.banned() as unknown as RegulationFile
      for (const rule of banned.rules) {
        rules.push(convertRuleToViolation(rule, country))
      }
    }

    // Load restricted ingredients
    if (files.restricted) {
      const restricted = await files.restricted() as unknown as RegulationFile
      for (const rule of restricted.rules) {
        rules.push(convertRuleToViolation(rule, country))
      }
    }

    // Load claims
    if (files.claims) {
      const claims = await files.claims() as unknown as RegulationFile
      for (const rule of claims.rules) {
        rules.push(convertRuleToViolation(rule, country))
      }
    }

    // Load label requirements
    if (files.label) {
      const label = await files.label() as unknown as RegulationFile
      for (const rule of label.rules) {
        rules.push(convertRuleToViolation(rule, country))
      }
    }

    // Load registration rules (Brazil only)
    if (country === 'BR' && files.registration) {
      const registration = await files.registration() as unknown as RegulationFile
      for (const rule of registration.rules) {
        rules.push(convertRuleToViolation(rule, country))
      }
    }

    // Update cache
    if (!rulesCache) {
      rulesCache = { BR: [], MX: [] }
    }
    rulesCache[country] = rules
    rulesCache.loadedAt = Date.now()

    console.log(`[RegulationLoader] Loaded ${rules.length} rules for ${country}`)
    return rules

  } catch (error) {
    console.error(`[RegulationLoader] Failed to load rules for ${country}:`, error)
    // Return empty array on error - engine will use fallback hardcoded rules
    return []
  }
}

// Synchronous version for SSR/build time - returns empty, uses async at runtime
export function getRegulationRulesSync(_country: 'BR' | 'MX'): LoadedRules[] {
  // This is a placeholder - actual loading happens at runtime
  return []
}

// Get rule count info for debugging
export function getRuleStats(): { BR: number; MX: number; loadedAt?: number } {
  if (!rulesCache) {
    return { BR: 0, MX: 0 }
  }
  return {
    BR: rulesCache.BR.length,
    MX: rulesCache.MX.length,
    loadedAt: rulesCache.loadedAt,
  }
}