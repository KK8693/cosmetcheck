import OpenAI from 'openai'

// ============================================
// AI Provider Configuration
// ============================================

export type AIProvider = 'deepseek' | 'openai'

export interface AIProviderConfig {
  provider: AIProvider
  apiKey: string
  baseURL: string
  model: string
}

// Available providers in priority order
const PROVIDERS: AIProviderConfig[] = [
  {
    provider: 'deepseek',
    apiKey: process.env.DEEPSEEK_API_KEY || '',
    baseURL: 'https://api.deepseek.com',
    model: 'deepseek-v4-flash',
  },
  {
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY || '',
    baseURL: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',  // Cost-effective, fast
  },
]

function getOpenAIClient(providerConfig: AIProviderConfig): OpenAI {
  if (!providerConfig.apiKey) {
    throw new Error(`${providerConfig.provider.toUpperCase()}_API_KEY is not configured`)
  }
  return new OpenAI({
    apiKey: providerConfig.apiKey,
    baseURL: providerConfig.baseURL,
  })
}

// Get the primary provider (first available with valid API key)
function getPrimaryProvider(): AIProviderConfig {
  for (const provider of PROVIDERS) {
    if (provider.apiKey) {
      console.log(`[AI] Primary provider: ${provider.provider} (${provider.model})`)
      return provider
    }
  }
  throw new Error('No AI provider configured. Set DEEPSEEK_API_KEY or OPENAI_API_KEY')
}

// Get fallback provider (second available with valid API key)
function getFallbackProvider(): AIProviderConfig | null {
  const available = PROVIDERS.filter(p => p.apiKey)
  if (available.length < 2) {
    console.warn(`[AI] No fallback provider configured (only ${available.length} provider(s) available)`)
    return null
  }
  const fallback = available[1]
  console.log(`[AI] Fallback provider: ${fallback.provider} (${fallback.model})`)
  return fallback
}

// Legacy function for backward compatibility
function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY || process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY or DEEPSEEK_API_KEY is not configured')
  }
  return new OpenAI({
    apiKey,
    baseURL: 'https://api.deepseek.com',
  })
}

// Retry configuration - optimized for Edge Runtime (Cloudflare Pages 30s limit)
const MAX_RETRIES = 2  // Limited by Edge Runtime timeout
const INITIAL_DELAY_MS = 2000  // 2s start
const MAX_DELAY_MS = 10000  // Cap at 10s
export const CONSECUTIVE_FAILURES_THRESHOLD = 3

// Pre-call sleep - minimal for Edge Runtime (cold start already provides spacing)
export const PRE_CALL_SLEEP_MIN = 0
export const PRE_CALL_SLEEP_MAX = 2000 // Max 2s

// 全局请求队列 - 防止请求突发
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL_MS = 3000  // 请求间隔至少 3 秒

export async function waitForRequestSlot(): Promise<void> {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL_MS) {
    const waitTime = MIN_REQUEST_INTERVAL_MS - timeSinceLastRequest
    console.log(`[RateLimit] Request queue: waiting ${Math.round(waitTime/1000)}s to prevent burst`)
    await sleep(waitTime)
  }
  
  lastRequestTime = Date.now()
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function isRateLimitError(error: unknown): boolean {
  if (!error) return false
  
  const errorObj = error as Record<string, unknown>
  
  // Check status code (common in OpenAI SDK errors)
  if (typeof errorObj.status === 'number' && errorObj.status === 429) {
    return true
  }
  
  // Check for various error message patterns including Chinese
  const message = typeof errorObj.message === 'string' ? errorObj.message : String(error)
  const rateLimitPatterns = [
    'rate limit',
    'RateLimit',
    '429',
    '请求频率已超出限制',
    'too many requests',
    '请稍后再试',
    '请求过于频繁'
  ]
  
  return rateLimitPatterns.some(pattern => message.toLowerCase().includes(pattern.toLowerCase()))
}

export function getRetryAfter(error: unknown): number | null {
  // Try to extract Retry-After from error response
  // 支持多种格式: plain object, Headers object, case-insensitive
  if (error && typeof error === 'object') {
    const err = error as Record<string, unknown>
    if (typeof err.response === 'object' && err.response !== null) {
      const resp = err.response as Record<string, unknown>
      if (typeof resp.headers === 'object' && resp.headers !== null) {
        const headers = resp.headers as Record<string, unknown>
        
        // 尝试多种可能的 header key
        const possibleKeys = [
          'retry-after',
          'Retry-After', 
          'X-RateLimit-Reset',
          'x-ratelimit-reset',
          'x-ratelimit-reset-seconds'
        ]
        
        for (const key of possibleKeys) {
          const value = headers[key]
          if (typeof value === 'string') {
            const seconds = parseInt(value, 10)
            if (!isNaN(seconds) && seconds > 0) {
              console.log(`[RateLimit] Found retry-after header: ${key} = ${seconds}s`)
              return seconds * 1000
            }
          }
        }
        
        // 兼容 Headers 对象 (有 .get() 方法)
        const headersObj = headers as { get?: (key: string) => string | null }
        if (typeof headersObj.get === 'function') {
          for (const key of possibleKeys) {
            const value = headersObj.get(key)
            if (value) {
              const seconds = parseInt(value, 10)
              if (!isNaN(seconds) && seconds > 0) {
                console.log(`[RateLimit] Found retry-after via .get(): ${key} = ${seconds}s`)
                return seconds * 1000
              }
            }
          }
        }
      }
    }
    
    // 备选方案: 直接从 error 对象提取
    const errObj = err as Record<string, unknown>
    if (typeof errObj.headers === 'object' && errObj.headers !== null) {
      const headers = errObj.headers as Record<string, unknown>
      const possibleKeys = ['retry-after', 'Retry-After', 'x-ratelimit-reset']
      for (const key of possibleKeys) {
        const value = headers[key]
        if (typeof value === 'string') {
          const seconds = parseInt(value, 10)
          if (!isNaN(seconds) && seconds > 0) {
            console.log(`[RateLimit] Found retry-after from error.headers: ${key} = ${seconds}s`)
            return seconds * 1000
          }
        }
      }
    }
  }
  return null
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  operationName: string = 'API call',
  maxRetries: number = MAX_RETRIES
): Promise<T> {
  let lastError: unknown
  let consecutiveFailures = 0
  
  // 全局请求队列 - 防止请求突发
  await waitForRequestSlot()
  
  // 预调用随机等待 - 消除请求突发
  const preCallDelay = Math.random() * (PRE_CALL_SLEEP_MAX - PRE_CALL_SLEEP_MIN) + PRE_CALL_SLEEP_MIN
  await sleep(preCallDelay)
  console.log(`[RateLimit] ${operationName} - pre-call wait: ${Math.round(preCallDelay/1000)}s`)
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await fn()
      return result
    } catch (error) {
      lastError = error
      consecutiveFailures++
      
      // Don't retry on non-rate-limit errors
      if (!isRateLimitError(error)) {
        throw error
      }
      
      // Don't wait after the last attempt
      if (attempt === maxRetries) {
        break
      }
      
      // Check for explicit retry-after header first
      const retryAfterMs = getRetryAfter(error)
      let delay: number
      
      if (retryAfterMs !== null) {
        // Use server-specified delay if available
        delay = retryAfterMs
        console.warn(`[RateLimit] ${operationName} - using server retry-after: ${retryAfterMs}ms`)
      } else {
        // 死慢退避策略：连续失败3次后，延迟翻倍
        const isConsecutiveFailure = consecutiveFailures >= CONSECUTIVE_FAILURES_THRESHOLD
        const baseDelay = Math.min(
          INITIAL_DELAY_MS * Math.pow(2, attempt),
          MAX_DELAY_MS
        )
        
        // 死慢退避：连续失败后额外增加延迟
        delay = isConsecutiveFailure 
          ? baseDelay * 2  // 连续失败时翻倍
          : baseDelay
        
        const jitter = Math.random() * 3000  // 增加 jitter (up to 3s)
        
        console.warn(
          `[RateLimit] ${operationName} hit rate limit, ` +
          `retrying in ${Math.round((delay + jitter) / 1000)}s... ` +
          `(attempt ${attempt + 1}/${maxRetries + 1})` +
          (isConsecutiveFailure ? ` [SLOW BACKOFF - consecutive failures: ${consecutiveFailures}]` : '')
        )
        delay = delay + jitter
      }
      
      await sleep(delay)
    }
  }
  
  throw lastError
}

export interface GenerateListingInput {
  productName: string
  ingredients?: string
  benefits?: string
  category: 'skincare' | 'makeup' | 'haircare' | 'fragrance' | 'bodycare'
  targetCountry: 'BR' | 'MX'
  tone?: 'professional' | 'friendly' | 'luxury'
  checkResult?: {
    isCompliant: boolean
    violations: Array<{
      message: string
      suggestion: string
      category?: string
      keyword?: string
      severity?: string
    }>
    warnings: Array<{
      message: string
      suggestion: string
      category?: string
      keyword?: string
      severity?: string
    }>
  }
}

export interface GeneratedListing {
  title: string
  description: string
  bulletPoints: string[]
  ingredientList: string[]  // 由代码直接生成的诚实成分列表（含违规标注）
  complianceNotes: string[]
  warnings: string[]
  language: 'pt-BR' | 'es-MX'
}

// INCI name mapping for common Chinese ingredient names
// Ensures output uses internationally recognized INCI nomenclature (ANVISA/COFEPRIS compliant)
const INCI_NAME_MAP: Record<string, string> = {
  '\u53bb\u79bb\u5b50\u6c34': 'Aqua',
  '\u6c34': 'Aqua',
  '\u7518\u6cb9': 'Glycerin',
  '\u4e19\u4e09\u9187': 'Glycerin',
  '\u6cdb\u9187': 'Panthenol',
  '\u7ef4\u751f\u7d20b5': 'Panthenol',
  '\u900f\u660e\u8d28\u9178\u94a0': 'Sodium Hyaluronate',
  '\u73bb\u5c3f\u9178': 'Sodium Hyaluronate',
  '\u79ef\u96ea\u8349\u63d0\u53d6\u7269': 'Centella Asiatica Extract',
  '\u79ef\u96ea\u8349': 'Centella Asiatica Extract',
  '\u7eff\u8336\u63d0\u53d6\u7269': 'Camellia Sinensis Leaf Extract',
  '\u7eff\u8336': 'Camellia Sinensis Leaf Extract',
  '\u751c\u83dc\u78b1': 'Betaine',
  '\u4e59\u57fa\u5df1\u57fa\u7518\u6cb9': 'Ethylhexylglycerin',
  '\u70df\u9170\u80fa': 'Niacinamide',
  '\u7ef4\u751f\u7d20c': 'Ascorbic Acid',
  '\u6297\u574f\u8840\u9178': 'Ascorbic Acid',
  '\u89c6\u9ec4\u9187': 'Retinol',
  '\u89d2\u9ca8\u70f7': 'Squalane',
  '\u795e\u7ecf\u9170\u80fa': 'Ceramide',
  '\u80f6\u539f\u86cb\u767d': 'Collagen',
  '\u8f85\u9176q10': 'Ubiquinone',
  '\u80dc\u80bd': 'Peptide',
  '\u6c28\u57fa\u9178': 'Amino Acids',
  '\u5c3f\u56ca\u7d20': 'Allantoin',
  '\u82a6\u8358\u63d0\u53d6\u7269': 'Aloe Barbadensis Leaf Extract',
  '\u82a6\u8358': 'Aloe Barbadensis Leaf Extract',
  '\u8336\u6811\u6cb9': 'Melaleuca Alternifolia Leaf Oil',
  '\u8336\u6811\u7cbe\u6cb9': 'Melaleuca Alternifolia Leaf Oil',
  '\u6c34\u6768\u9178': 'Salicylic Acid',
  '\u679c\u9178': 'AHA',
  '\u4e73\u9178': 'Lactic Acid',
  '\u718a\u679c\u82f7': 'Arbutin',
  '\u66f2\u9178': 'Kojic Acid',
  '\u7518\u8349\u63d0\u53d6\u7269': 'Glycyrrhiza Glabra Root Extract',
  '\u91d1\u7f05\u6885\u63d0\u53d6\u7269': 'Hamamelis Virginiana Extract',
  '\u73ab\u7470\u63d0\u53d6\u7269': 'Rosa Damascena Flower Extract',
  '\u85b0\u8863\u8349\u63d0\u53d6\u7269': 'Lavandula Angustifolia Extract',
  '\u6d0b\u7518\u83ca\u63d0\u53d6\u7269': 'Chamomilla Recutita Flower Extract',
  '\u9a6c\u9f7f\u82a5\u63d0\u53d6\u7269': 'Portulaca Oleracea Extract',
  '\u4e8c\u70c8\u57fa\u7532\u915a': 'BHT',
  '\u5c3c\u6cca\u91d1\u916f': 'Paraben',
  '\u5bf9\u7fb3\u57fa\u82ef\u7532\u9178\u916f': 'Paraben',
  '\u7532\u6c27\u57fa\u82ef\u7532\u9178\u916f\u7532\u916f': 'Methylparaben',
  '\u7532\u6c27\u57fa\u82ef\u7532\u9178\u916f\u4e19\u916f': 'Propylparaben',
  '\u82ef\u6c27\u57fa\u4e59\u9187': 'Phenoxyethanol',
  '\u5361\u6ce2\u59c6': 'Carbomer',
  '\u4e09\u4e59\u9187\u80fa': 'Triethanolamine',
  '\u78b3\u9178\u4e8c\u7532\u916f': 'Dimethicone',
  '\u73af\u4e94\u805a\u4e8c\u7532\u57fa\u7845\u6c27\u70f7': 'Cyclopentasiloxane',
  '\u767d\u6cb9': 'Mineral Oil',
  '\u6db2\u4f53\u77f3\u8721': 'Mineral Oil',
  '\u6843\u80b1\u7ea2\u8272\u7d20': 'CI 16035',
}

function getIncIName(rawName: string): string {
  return INCI_NAME_MAP[rawName] || rawName
}

// Build honest ingredient list directly from code (not AI)
// This ensures ingredient honesty regardless of AI behavior
function buildIngredientList(input: GenerateListingInput): {
  ingredientList: string[]
  complianceNotes: string[]
} {
  const result = {
    ingredientList: [] as string[],
    complianceNotes: [] as string[],
  }

  if (!input.ingredients) {
    return result
  }

  // Parse ingredients string (support Chinese commas, English commas, etc.)
  const rawIngredients = input.ingredients
    .split(/[,\uff0c\u3001;\uff1b]/)
    .map(s => s.trim())
    .filter(Boolean)

  if (rawIngredients.length === 0) {
    return result
  }

  // Build violation map from checkResult
  const violationMap = new Map<string, { message: string; severity: string; isAntibiotic: boolean }>()
  if (input.checkResult) {
    for (const v of input.checkResult.violations) {
      if (v.category === 'ingredient' && v.keyword) {
        violationMap.set(v.keyword.toLowerCase(), {
          message: v.message,
          severity: v.severity || 'critical',
          isAntibiotic: v.message.toLowerCase().includes('antibi') || v.keyword.toLowerCase().includes('metronidazol'),
        })
      }
    }
    for (const w of input.checkResult.warnings) {
      if (w.category === 'ingredient' && w.keyword) {
        const key = w.keyword.toLowerCase()
        if (!violationMap.has(key)) {
          violationMap.set(key, {
            message: w.message,
            severity: w.severity || 'warning',
            isAntibiotic: w.message.toLowerCase().includes('antibi') || w.keyword.toLowerCase().includes('metronidazol'),
          })
        }
      }
    }
  }

  // Known prohibited ingredient keywords (fallback when checkResult is not available)
  const prohibitedKeywords = [
    'hydroquinone', 'hidroquinona', '\u6c22\u919b', '\u5bf9\u82ef\u4e8c\u915a',
    'tretinoin', 'retinoic', 'retinoico', '\u7ef4a\u9178', 'tretino\u00edna', '\u00e1cido retinoico',
    'metronidazol', 'metronidazole', '\u7532\u785d\u5511',
    'mercury', 'merc\u00fario', '\u6c5e',
    'lead', 'chumbo', '\u94c5',
    'corticosteroid', 'corticoster\u00f3ide', '\u76ae\u8d28\u7c7b\u56fa\u9187',
    'formaldehyde', 'formalde\u00eddo', '\u7532\u919b',
    'hormone', 'horm\u00f4nio', 'hormonio', '\u6fc0\u7d20',
  ]

  const restrictedKeywords = [
    'paraben', 'parabeno', 'nipagin', 'nipasol', '\u5c3c\u6cca\u91d1\u916f',
    'retinol', '\u89c6\u9ec4\u9187',
  ]

  for (const originalIngredient of rawIngredients) {
    const lower = originalIngredient.toLowerCase()
    // Convert to INCI name for display (ANVISA/COFEPRIS compliant labeling)
    const displayIngredient = getIncIName(originalIngredient)
    let flagged = false

    // Check against violation map (from compliance engine)
    for (const [keyword, info] of violationMap) {
      if (lower.includes(keyword)) {
        const icon = info.severity === 'critical' ? '\ud83d\udd34' : '\u26a0\ufe0f'
        const prefix = info.isAntibiotic
          ? `${icon} PROIBIDO (antibiótico)`
          : `${icon} PROIBIDO`
        result.ingredientList.push(`${displayIngredient} (${prefix}: ${info.message})`)
        flagged = true
        break
      }
    }

    if (!flagged) {
      // Fallback: check against known keyword lists
      const isProhibited = prohibitedKeywords.some(k => lower.includes(k))
      const isRestricted = restrictedKeywords.some(k => lower.includes(k))

      if (isProhibited) {
        result.ingredientList.push(`${displayIngredient} (\ud83d\udd34 PROIBIDO em cosméticos pela ANVISA)`)
      } else if (isRestricted) {
        result.ingredientList.push(`${displayIngredient} (\u26a0\ufe0f RESTRITO - verificar concentração)`)
      } else {
        result.ingredientList.push(displayIngredient)
      }
    }
  }

  // Generate compliance notes for prohibited ingredients
  const prohibitedInFormula = result.ingredientList.filter(i => i.includes('\ud83d\udd34 PROIBIDO'))
  if (prohibitedInFormula.length > 0) {
    result.complianceNotes.push(
      `\ud83d\udd34 PRODUTO NÃO COMERCIALIZÁVEL: A fórmula contém ${prohibitedInFormula.length} ingrediente(s) PROIBIDO(s) pela ANVISA. ` +
      `Este produto NÃO pode ser vendido no Brasil sem reformulação completa.`
    )
  }

  return result
}

// Post-processing validation: enforce claim-consistency and detect AI hallucinations
function validateListing(
  listing: GeneratedListing,
  input: GenerateListingInput
): GeneratedListing {
  const result = { ...listing }
  const ingredients = (input.ingredients || '').toLowerCase()
  const titleDesc = `${result.title} ${result.description}`.toLowerCase()
  const bullets = result.bulletPoints.join(' ').toLowerCase()
  const allText = `${titleDesc} ${bullets}`

  // Extract problematic ingredients from checkResult
  const problematicIngredients: string[] = []
  if (input.checkResult) {
    for (const v of input.checkResult.violations) {
      if (v.category === 'ingredient' && v.keyword) {
        problematicIngredients.push(v.keyword.toLowerCase())
      }
    }
    for (const w of input.checkResult.warnings) {
      if (w.category === 'ingredient' && w.keyword) {
        problematicIngredients.push(w.keyword.toLowerCase())
      }
    }
  }

  // 1. DETECT AI INVENTING INGREDIENTS IN MARKETING COPY
  // AI should never mention specific ingredient names. If it does, flag it.
  const allNotesText = [...result.complianceNotes, ...result.warnings].join(' ').toLowerCase()

  // Multi-language alias map for common prohibited ingredients
  const ingredientAliases: Record<string, string[]> = {
    'hydroquinone': ['hidroquinona', '\u6c22\u919b'],
    'retinoic': ['\u00e1cido retinoico', 'retinoico', '\u7ef4a\u9178'],
    'metronidazol': ['metronidazol', '\u7532\u785d\u5511'],
    'hormone': ['horm\u00f4nio', 'hormonio', '\u6fc0\u7d20'],
    'mercury': ['merc\u00fario', '\u6c5e'],
    'lead': ['chumbo', '\u94c5'],
    'formaldehyde': ['formalde\u00eddo', '\u7532\u919b'],
    'paraben': ['parabeno', 'nipagin', 'nipasol', '\u5c3c\u6cca\u91d1\u916f'],
  }

  for (const banned of problematicIngredients) {
    const aliases = ingredientAliases[banned] || []
    const allForms = [banned, ...aliases]
    const isMentioned = allForms.some(form => allText.includes(form) || allNotesText.includes(form))
    if (isMentioned) {
      const inventionWarning = `\ud83d\udd34 ERRO DE IA: O ingrediente proibido "${banned}" (ou sua varia\u00e7\u00e3o lingu\u00edstica) foi mencionado no texto de marketing (t\u00edtulo/descri\u00e7\u00e3o/bullet points). A IA N\u00c3O deve mencionar nomes de ingredientes espec\u00edficos no conte\u00fado de marketing. Remova todas as refer\u00eancias a este ingrediente do texto.`
      result.warnings = [inventionWarning, ...result.warnings]
      console.warn(`[AI Validate] \ud83d\udd34 AI mentioned prohibited ingredient "${banned}" in marketing copy`)
    }
  }

  // 2. SUNSCREEN CLAIM CONSISTENCY
  // Check if listing claims sun protection but ingredients lack sunscreen actives
  const sunscreenActives = [
    'zinc oxide', 'titanium dioxide', 'avobenzone', 'oxybenzone', 'octinoxate',
    'octocrylene', 'homosalate', 'octisalate', 'ensulizole', 'tinosorb',
    '\u6c27\u5316\u950c', '\u6c27\u5316\u949b', '\u9632\u6652\u5242', 'avobenzona', '\u00f3xido de zinco', 'di\u00f3xido de tit\u00e2nio'
  ]
  const hasSunscreenIngredients = sunscreenActives.some(a => ingredients.includes(a))
  const hasSunscreenClaim =
    /fps\s*\d+|spf\s*\d+|prote[c\u00e7][a\u00e3]o\s+solar|bloqueador|sunscreen|anti-uv|\bradia[c\u00e7][a\u00e3]o\s+uv\b|protege[r]?\b.*\buv\b|prote[c\u00e7][a\u00e3]o\s+.*\buv\b|contra\s+.*\buv\b|efeitos?\s+.*\buv\b|exposi[c\u00e7][a\u00e3]o\s+.*\buv\b|danos?\s+.*\buv\b|estresse\s+oxidativo\s+.*\buv\b/i.test(allText)

  if (hasSunscreenClaim && !hasSunscreenIngredients) {
    const inconsistencyWarning = `\u26a0\ufe0f INCONSIST\u00caNCIA: A listagem menciona prote\u00e7\u00e3o/efeitos relacionados a UV, mas a f\u00f3rmula N\u00c3O cont\u00e9m ativos de prote\u00e7\u00e3o solar (ex: \u00f3xido de zinco, di\u00f3xido de tit\u00e2nio, avobenzona). Remova as alega\u00e7\u00f5es de prote\u00e7\u00e3o UV/SPF/FPS ou adicione ativos de prote\u00e7\u00e3o solar \u00e0 f\u00f3rmula. Al\u00e9m disso, produtos com prote\u00e7\u00e3o UV requerem registro ESPECIAL na ANVISA.`
    result.warnings = [inconsistencyWarning, ...result.warnings]
    console.warn('[AI Validate] \ud83d\udd34 Sunscreen/UV claim without sunscreen ingredients')
  }

  // 3. SENSITIVE SKIN CLAIM CHECK
  // Catch "todos os tipos de pele" in any form - this requires clinical proof
  const sensitiveSkinPattern = /todos\s+(os\s+)?tipos\s+de\s+pele|all\s+skin\s+types|suitable\s+for\s+all\s+skin\s+types/i
  if (sensitiveSkinPattern.test(allText)) {
    const sensitiveWarning = `\u26a0\ufe0f ALEGA\u00c7\u00c3O DE PELE: A frase "todos os tipos de pele" (ou similar) requer testes dermatol\u00f3gicos comprovados. Recomendado: "adequado para a maioria dos tipos de pele" ou incluir aviso "Teste de toque recomendado para peles sens\u00edveis".`
    result.warnings = [sensitiveWarning, ...result.warnings]
    console.warn('[AI Validate] \ud83d\udfe1 Sensitive skin claim detected')
  }

  // 4. WHITENING/SKIN LIGHTENING REGISTRATION WARNING
  const whiteningPattern = /clareador|clareamento|branqueador|whitening|lightening|desmanchador|anti-manchas\s+intenso/i
  if (whiteningPattern.test(allText)) {
    const whiteningNote = `\u26a0\ufe0f REGISTRO ESPECIAL REQUERIDO: Produtos com alega\u00e7\u00f5es de clareamento/branqueamento da pele ("clareador", "anti-manchas intensivo") requerem registro ESPECIAL na ANVISA, al\u00e9m da notifica\u00e7\u00e3o cosm\u00e9tica normal. O processo \u00e9 mais longo e exige estudos de seguran\u00e7a adicionais.`
    const alreadyMentioned = result.complianceNotes.some(n => n.toLowerCase().includes('registro especial') && n.toLowerCase().includes('clareamento'))
    if (!alreadyMentioned) {
      result.complianceNotes = [whiteningNote, ...result.complianceNotes]
      console.warn('[AI Validate] \ud83d\udfe1 Whitening claim - special registration required')
    }
  }

  // 5. INGREDIENT DENIAL CHECK
  // Check if listing claims "free of X" or "does not contain X" when X IS in the formula
  const parabenKeywords = ['paraben', 'parabeno', 'nipagin', 'nipasol', '\u5c3c\u6cca\u91d1\u916f', '\u5bf9\u7fb3\u57fa\u82ef\u7532\u9178\u916f', 'methylparaben', 'propylparaben', 'butylparaben', 'ethylparaben']
  const hasParabenInFormula = parabenKeywords.some(p => ingredients.includes(p))
  const parabenDenialPatterns = [
    'livre de parabenos?', 'sem parabenos?', 'n\u00e3o cont\u00e9m parabenos?', 'nao contem parabenos?',
    'free of parabens?', 'no parabens?', 'without parabens?', 'paraben-free',
    '\u4e0d\u542b\u5c3c\u6cca\u91d1\u916f', '\u65e0\u5c3c\u6cca\u91d1\u916f', '\u4e0d\u542bparaben', '\u65e0paraben'
  ]
  const hasParabenDenial = parabenDenialPatterns.some(p => allText.includes(p) || allNotesText.includes(p))
  if (hasParabenInFormula && hasParabenDenial) {
    const parabenWarning = `\ud83d\udd34 INCONSIST\u00caNCIA: A f\u00f3rmula CONT\u00c9M parabenos, mas a listagem alega "livre de parabenos". Isso \u00e9 FALSO e pode resultar em penalidades da ANVISA. A f\u00f3rmula real \u00e9 a informada pelo usu\u00e1rio \u2014 a listagem n\u00e3o deve negar ingredientes reais.`
    result.warnings = [parabenWarning, ...result.warnings]
    console.warn('[AI Validate] \ud83d\udd34 Paraben denial detected when parabens ARE in formula')
  }

  // 6. DETECT FALSE "REMOVED" OR "REFORMULATED" CLAIMS
  // Build dynamic patterns from problematic ingredients
  const removalPatterns = [
    /n\u00e3o\s+cont\u00e9m\s+.*removido/i,
    /foi\s+removido/i,
    /reformulado\s+sem/i,
    /removido\s+para\s+conformidade/i,
    /does\s+not\s+contain.*removed/i,
    /was\s+removed/i,
    /reformulated\s+without/i,
    /\u4e0d\u542b.*\u5df2\u79fb\u9664/i,
    /\u5df2\u79fb\u9664/i,
    /\u53bb\u9664.*\u540e/i,
  ]
  // Also check dynamic patterns: "não contém [banned ingredient]"
  for (const banned of problematicIngredients) {
    const aliases = ingredientAliases[banned] || []
    const allForms = [banned, ...aliases]
    for (const form of allForms) {
      removalPatterns.push(new RegExp(`n\u00e3o\\s+cont\u00e9m\\s+.*${form}`, 'i'))
      removalPatterns.push(new RegExp(`nao\\s+contem\\s+.*${form}`, 'i'))
      removalPatterns.push(new RegExp(`sem\\s+.*${form}`, 'i'))
      removalPatterns.push(new RegExp(`reformulado\\s+sem\\s+.*${form}`, 'i'))
      removalPatterns.push(new RegExp(`reformulada\\s+sem\\s+.*${form}`, 'i'))
      removalPatterns.push(new RegExp(`foi\\s+removid[oa]\\s+.*${form}`, 'i'))
    }
  }
  for (const pattern of removalPatterns) {
    if (pattern.test(allText) || pattern.test(allNotesText)) {
      const removalWarning = `\ud83d\udd34 ERRO DE IA: A listagem cont\u00e9m alega\u00e7\u00e3o falsa de que ingredientes foram "removidos" ou "reformulados". A f\u00f3rmula \u00e9 exatamente a informada pelo usu\u00e1rio \u2014 a IA N\u00c3O deve inventar remo\u00e7\u00f5es de ingredientes. O ingredient list \u00e9 gerado pelo sistema com honestidade total.`
      result.warnings = [removalWarning, ...result.warnings]
      console.warn('[AI Validate] \ud83d\udd34 AI falsely claimed ingredients were removed/reformulated')
      break
    }
  }

  // 7. DETECT CLAIM UPGRADES (AI escalating mild user claims to strong regulatory-risk claims)
  const userBenefits = (input.benefits || '').toLowerCase()
  const userIngredients = (input.ingredients || '').toLowerCase()
  const userProductName = input.productName.toLowerCase()
  const userInputCombined = `${userProductName} ${userBenefits} ${userIngredients}`

  // 7a. Spot/melasma upgrade: user said "uneven tone" but AI wrote "reduces spots"
  const hasSpotClaimInAI = /manchas?|melasma|desmanchador|clareador\s+de\s+manchas/i.test(allText)
  const hasSpotMentionInInput = /manchas?|melasma|desmanchador|spot/i.test(userInputCombined)
  if (hasSpotClaimInAI && !hasSpotMentionInInput) {
    const spotWarning = `\u26a0\ufe0f UPGRADE DE ALEGA\u00c7\u00c3O: A IA adicionou alega\u00e7\u00f5es sobre "manchas/melasma" que N\u00c3O foram mencionadas na descri\u00e7\u00e3o original do produto. "Uniformizar o tom da pele" N\u00c3O \u00e9 o mesmo que "reduzir manchas". Produtos com alega\u00e7\u00f5es de clareamento de manchas podem exigir registro ESPECIAL na ANVISA.`
    result.warnings = [spotWarning, ...result.warnings]
    console.warn('[AI Validate] \ud83d\udfe1 AI upgraded "uneven tone" to "spot/melasma" claims')
  }

  // 7b. Pore refinement upgrade: user said "smooth texture" but AI wrote "refines pores"
  const hasPoreClaimInAI = /refina\s+os\s+poros|refinando\s+os\s+poros|poros\s+dilatados|poros\s+abertos/i.test(allText)
  const hasPoreMentionInInput = /poros?|pore/i.test(userInputCombined)
  if (hasPoreClaimInAI && !hasPoreMentionInInput) {
    const poreWarning = `\u26a0\ufe0f UPGRADE DE ALEGA\u00c7\u00c3O: A IA adicionou alega\u00e7\u00f5es sobre "refinamento de poros" que N\u00c3O foram mencionadas na descri\u00e7\u00e3o original. "Melhorar a textura da pele" N\u00c3O \u00e9 o mesmo que "refinar poros". Alega\u00e7\u00f5es de tratamento de poros podem exigir comprova\u00e7\u00e3o adicional.`
    result.warnings = [poreWarning, ...result.warnings]
    console.warn('[AI Validate] \ud83d\udfe1 AI upgraded "smooth texture" to "pore refining" claims')
  }

  // 7c. Non-comedogenic claim without user input
  const hasNonComedogenicClaim = /n\u00e3o\s+obstrui\s+os\s+poros|n\u00e3o\s+comedog\u00eanico|non-comedogenic|n\u00e3o\s+comedog\u00eanica/i.test(allText)
  const hasNonComedogenicInput = /n\u00e3o\s+obstrui|n\u00e3o\s+comedog|non-comedogenic|n\u00e3o\s+entope/i.test(userInputCombined)
  if (hasNonComedogenicClaim && !hasNonComedogenicInput) {
    const ncWarning = `\u26a0\ufe0f ALEGA\u00c7\u00c3O N\u00c3O SUPORTADA: A IA adicionou "n\u00e3o obstrui os poros" / "n\u00e3o comedog\u00eanico" sem que o usu\u00e1rio tenha informado isso. Alega\u00e7\u00f5es de n\u00e3o comedogenicidade requerem testes laboratoriais comprovados.`
    result.warnings = [ncWarning, ...result.warnings]
    console.warn('[AI Validate] \ud83d\udfe1 AI invented non-comedogenic claim without user input')
  }

  // 7d. Intensity escalation: lightweight → intense
  const hasIntenseHydrationClaim = /hidrat[aa]\s+intensamente|hidrata\u00e7\u00e3o\s+intensa|hidratante\s+intensivo/i.test(allText)
  const hasLightweightInput = /leve|ligeiro|lightweight|fresh|refrescante|n\u00e3o\s+oleoso/i.test(userInputCombined)
  if (hasIntenseHydrationClaim && hasLightweightInput) {
    const intensityWarning = `\u26a0\ufe0f ESCALA\u00c7\u00c3O DE INTENSIDADE: O usu\u00e1rio descreveu o produto como "leve/refrescante", mas a IA usou "hidrata intensamente". A intensidade da alega\u00e7\u00e3o deve corresponder \u00e0 descri\u00e7\u00e3o original do produto.`
    result.warnings = [intensityWarning, ...result.warnings]
    console.warn('[AI Validate] \ud83d\udfe1 AI escalated "lightweight" to "intense hydration"')
  }

  return result
}

function getSystemPrompt(input: GenerateListingInput): string {
  const country = input.targetCountry === 'BR' ? 'Brazil' : 'Mexico'
  const language = input.targetCountry === 'BR' ? 'Brazilian Portuguese (pt-BR)' : 'Mexican Spanish (es-MX)'
  const regulation = input.targetCountry === 'BR' ? 'ANVISA' : 'COFEPRIS'

  // Extract problematic claims only (NOT ingredients - AI must never see them)
  const problematicClaims: string[] = []
  if (input.checkResult) {
    for (const v of input.checkResult.violations) {
      if ((v.category === 'claim' || v.category === 'label') && v.keyword) {
        problematicClaims.push(v.keyword)
      }
    }
    for (const w of input.checkResult.warnings) {
      if ((w.category === 'claim' || w.category === 'label') && w.keyword) {
        problematicClaims.push(w.keyword)
      }
    }
  }

  // Determine if there are ingredient violations so we can set the right tone
  const hasIngredientViolations = input.checkResult?.violations?.some(
    v => v.category === 'ingredient'
  ) || false

  let prompt = `You are an expert e-commerce copywriter specializing in Latin American beauty products.

TASK: Generate a high-converting, ${regulation}-compliant product listing TITLE, DESCRIPTION, and BULLET POINTS for ${country} in ${language}.

CRITICAL RULES (violating any will cause regulatory penalties):

1. LANGUAGE: Write ONLY in ${language}. Do not mix languages.

2. NEVER MENTION SPECIFIC INGREDIENTS (MOST IMPORTANT):
   - You MUST NOT mention any specific ingredient names in title, description, or bullet points
   - You MUST NOT mention "retinoic acid", "tretinoin", "metronidazol", "hydroquinone", "parabens", "mercury", "lead", or any other chemical names
   - You MUST NOT mention "contains X", "with X", "enriched with X" where X is an ingredient name
   - Focus ONLY on cosmetic BENEFITS and USER EXPERIENCE, never on ingredient chemistry
   - CORRECT bullet: "Promotes a more even skin tone appearance" (benefit-focused, no ingredient name)
   - WRONG bullet: "Contains kojic acid for whitening" (mentions specific ingredient!)
   - CORRECT title: "Sérum Hidratante Clareador" (benefit-focused)
   - WRONG title: "Sérum com Ácido Kójico" (mentions specific ingredient!)
   - The ingredient list is generated separately by the system - do NOT include it in your output

3. NEVER CLAIM REMOVAL OF INGREDIENTS:
   - NEVER write phrases like "Este produto NÃO contém X" (This product does not contain X)
   - NEVER write "X foi removido para conformidade" (X was removed for compliance)
   - NEVER write "fórmula reformulada sem X" (reformulated without X)
   - These are false claims. The formula is what it is. You just write marketing copy for it.

4. CLAIM-INGREDIENT CONSISTENCY:
   - NEVER claim sun protection or UV defense (SPF/FPS/UV protection/anti-UV/radiação UV) unless the product is explicitly a sunscreen
   - If the product is NOT a sunscreen, do NOT include any UV-related claims
   - Only list benefits that are plausible for the product category

5. SPECIAL PRODUCT REGISTRATION WARNINGS:
   - If the product claims skin lightening/whitening ("clareador", "clareamento", "branqueador"), it requires SPECIAL registration with ${regulation}
   - If the product claims sun protection (SPF/FPS/UV), it requires SPECIAL registration with ${regulation}
   - These claims MUST be flagged in complianceNotes

6. SENSITIVE SKIN CLAIMS:
   - Do NOT claim "suitable for all skin types including sensitive skin"
   - Do NOT claim "todos os tipos de pele" (all skin types) anywhere
   - Use softer language: "suitable for most skin types" or "gentle formula"
   - If you mention sensitive skin, add: "Patch test recommended for sensitive skin"

7. COMPLIANCE - ${regulation} regulations:
   - NO medical/therapeutic claims (no "treats", "cures", "heals", "medicinal", "medical grade")
   - NO anti-aging claims as primary selling point (no "anti-idade", "anti-envelhecimento" in title)
   - Instead use: "para pele madura" or "reduz a aparência de linhas finas"
   - NO absolute claims without proof (no "100%", "completely", "totally", "zero", "permanent", "forever")
   - NO specific time-based results (no "7 days", "instant", "immediate", "24 hours", "28 days")
   - NO safety claims about pregnancy or children without clinical proof
   - Use only cosmetic claims: moisturizing, cleansing, beautifying, perfuming, protecting
   - Use hedging language: "helps to", "promotes", "assists in", "reduces the appearance of"

7b. CLAIM UPGRADE PROHIBITION (CRITICAL - prevents regulatory escalation):
   - NEVER add benefits that are NOT explicitly mentioned in the user's original product description
   - If user mentions "uneven skin tone", do NOT upgrade to "reduces spots/manchas/desmancha"
   - If user mentions "smooth skin texture", do NOT upgrade to "refines pores/refinando os poros"
   - If user mentions "lightweight hydration", do NOT upgrade to "intense hydration/hidrata intensamente"
   - NEVER claim "non-comedogenic" / "does not clog pores" / "n\u00e3o obstrui os poros" unless user explicitly states it
   - NEVER claim acne-related benefits (anti-acne, prevents pimples) unless user explicitly states it
   - Match the INTENSITY LEVEL of the original description \u2014 do not escalate mild claims to strong claims
   - CORRECT: "ajuda a uniformizar a apar\u00eancia do tom da pele" (matches "uneven skin tone")
   - WRONG: "reduz a apar\u00eancia de manchas e melasma" (upgrades to spots/pigmentation!)

${hasIngredientViolations ? `8. FORMULA HAS REGULATORY ISSUES:
   - The product formula contains ingredients that are prohibited or restricted by ${regulation}
   - You MUST write marketing copy that does NOT highlight these problematic aspects
   - Focus on general cosmetic benefits the product CAN offer
   - Do NOT make claims that would require the prohibited ingredients to be effective
   - Keep tone factual and benefit-oriented, avoiding any ingredient-specific claims` : ''}

9. Structure: Provide exactly this JSON format:
   {
     "title": "Product title (max 200 chars, catchy, keyword-rich, NO ingredient names, NO banned terms)",
     "description": "Engaging product description (2-3 paragraphs, 300-500 chars, NO ingredient names)",
     "bulletPoints": ["5-7 selling points, each 1-2 sentences, benefit-focused, NO ingredient names"],
     "complianceNotes": ["General regulatory compliance notes (NOT ingredient-specific disclosures)"],
     "warnings": ["Any compliance warnings"]
   }

10. Tone: ${input.tone || 'professional'}
11. Target audience: Beauty consumers in ${country}
12. Platform style: Adapt for Mercado Livre / Amazon / Shopee style listings

PRODUCT INFO:
- Name: ${input.productName}
- Category: ${input.category}
${input.benefits ? `- Product benefits direction: ${input.benefits}` : ''}
${input.ingredients ? `- Product type hint: ${input.category} product` : ''}
`

  if (input.checkResult && !input.checkResult.isCompliant) {
    if (problematicClaims.length > 0) {
      prompt += `
PROBLEMATIC CLAIMS TO AVOID IN YOUR COPY:
${problematicClaims.map(c => `- ${c}`).join('\n')}
`
    }
  }

  prompt += `
Output ONLY valid JSON. No markdown, no explanations outside JSON. Do NOT include ingredient lists in your output.`

  return prompt
}

export async function generateListing(
  input: GenerateListingInput
): Promise<GeneratedListing> {
  // Use primary provider (DeepSeek) with fallback to OpenAI
  const primary = getPrimaryProvider()
  const fallback = getFallbackProvider()
  
  let openai: OpenAI
  let currentProvider: string
  let model: string
  
  // Try primary first
  openai = getOpenAIClient(primary)
  currentProvider = primary.provider
  model = primary.model
  console.log(`[AI] Using provider: ${currentProvider} (${model})`)

  // Attempt with primary, fallback to OpenAI on rate limit
  let lastError: unknown
  let usedFallback = false
  
  try {
    const response = await withRetry(
      () =>
        openai.chat.completions.create({
          model: model,
          messages: [
            {
              role: 'system',
              content: getSystemPrompt(input),
            },
            {
              role: 'user',
              content: `Generate a ${input.targetCountry === 'BR' ? 'Brazilian Portuguese' : 'Mexican Spanish'} listing for: ${input.productName}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 1500,
          response_format: { type: 'json_object' },
        }),
      `${currentProvider} generateListing`
    )
    
    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('Empty response from AI provider')
    }

    const parsed = JSON.parse(content)
    
    // Build honest ingredient list from code (not AI)
    const codeData = buildIngredientList(input)
    
    const rawListing: GeneratedListing = {
      title: parsed.title || '',
      description: parsed.description || '',
      bulletPoints: Array.isArray(parsed.bulletPoints) ? parsed.bulletPoints : [],
      ingredientList: codeData.ingredientList,
      complianceNotes: [...codeData.complianceNotes, ...(Array.isArray(parsed.complianceNotes) ? parsed.complianceNotes : [])],
      warnings: Array.isArray(parsed.warnings) ? parsed.warnings : [],
      language: input.targetCountry === 'BR' ? 'pt-BR' : 'es-MX',
    }
    // Post-process: enforce claim-consistency
    return validateListing(rawListing, input)
  } catch (error) {
    // If rate limit and fallback available, try OpenAI
    if (isRateLimitError(error) && fallback && !usedFallback) {
      console.warn(`[AI] ${currentProvider} rate limited, falling back to ${fallback.provider}`)
      usedFallback = true
      
      openai = getOpenAIClient(fallback)
      currentProvider = fallback.provider
      model = fallback.model
      
      // Retry with fallback provider (no need to wrap in withRetry again as it's already inside)
      const response = await openai.chat.completions.create({
        model: model,
        messages: [
          {
            role: 'system',
            content: getSystemPrompt(input),
          },
          {
            role: 'user',
            content: `Generate a ${input.targetCountry === 'BR' ? 'Brazilian Portuguese' : 'Mexican Spanish'} listing for: ${input.productName}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: 'json_object' },
      })
      
      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('Empty response from fallback provider')
      }
      
      const parsedFallback = JSON.parse(content)
      
      // Build honest ingredient list from code (not AI)
      const codeDataFallback = buildIngredientList(input)
      
      const rawFallbackListing: GeneratedListing = {
        title: parsedFallback.title || '',
        description: parsedFallback.description || '',
        bulletPoints: Array.isArray(parsedFallback.bulletPoints) ? parsedFallback.bulletPoints : [],
        ingredientList: codeDataFallback.ingredientList,
        complianceNotes: [...codeDataFallback.complianceNotes, ...(Array.isArray(parsedFallback.complianceNotes) ? parsedFallback.complianceNotes : [])],
        warnings: Array.isArray(parsedFallback.warnings) ? parsedFallback.warnings : [],
        language: input.targetCountry === 'BR' ? 'pt-BR' : 'es-MX',
      }
      return validateListing(rawFallbackListing, input)
    }
    
    // 增强：非 rate limit 错误也尝试 fallback（如果是严重连接错误或 provider 服务不可用）
    const errorMessage = error instanceof Error ? error.message : String(error)
    const isConnectionError = 
      errorMessage.includes('fetch failed') ||
      errorMessage.includes('ECONNREFUSED') ||
      errorMessage.includes('ETIMEDOUT') ||
      errorMessage.includes('timeout') ||
      errorMessage.includes('unable to connect') ||
      errorMessage.includes('getaddrinfo') ||
      (typeof (error as Record<string, unknown>).status === 'number' && 
       [500, 502, 503, 504].includes((error as Record<string, unknown>).status as number))
    
    if (isConnectionError && fallback && !usedFallback) {
      console.warn(`[AI] ${currentProvider} connection failed (${errorMessage}), falling back to ${fallback.provider}`)
      usedFallback = true
      
      openai = getOpenAIClient(fallback)
      currentProvider = fallback.provider
      model = fallback.model
      
      const response = await openai.chat.completions.create({
        model: model,
        messages: [
          {
            role: 'system',
            content: getSystemPrompt(input),
          },
          {
            role: 'user',
            content: `Generate a ${input.targetCountry === 'BR' ? 'Brazilian Portuguese' : 'Mexican Spanish'} listing for: ${input.productName}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: 'json_object' },
      })
      
      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('Empty response from fallback provider')
      }
      
      const parsedConn = JSON.parse(content)
      
      // Build honest ingredient list from code (not AI)
      const codeDataConn = buildIngredientList(input)
      
      const rawConnListing: GeneratedListing = {
        title: parsedConn.title || '',
        description: parsedConn.description || '',
        bulletPoints: Array.isArray(parsedConn.bulletPoints) ? parsedConn.bulletPoints : [],
        ingredientList: codeDataConn.ingredientList,
        complianceNotes: [...codeDataConn.complianceNotes, ...(Array.isArray(parsedConn.complianceNotes) ? parsedConn.complianceNotes : [])],
        warnings: Array.isArray(parsedConn.warnings) ? parsedConn.warnings : [],
        language: input.targetCountry === 'BR' ? 'pt-BR' : 'es-MX',
      }
      return validateListing(rawConnListing, input)
    }
    
    // No fallback or not a recoverable error, throw with provider context
    console.error(`[AI] ${currentProvider} generation failed:`, errorMessage)
    throw error
  }
}

// ============================================
// AI Chat (Customer Support & Compliance Advisor)
// ============================================

export type ChatMode = 'support' | 'advisor'

const SUPPORT_SYSTEM_PROMPT = `You are CosmetCheck's AI customer support assistant. You help users with product usage, pricing, feature questions, and common issues.

CosmetCheck is a compliance detection tool for Chinese sellers exporting cosmetics to Latin America, primarily Brazil (ANVISA) and Mexico (COFEPRIS).

Key facts:
- Free plan: 10 compliance checks per 30 days, no registration required (IP-based)
- Pro plan ($29/month or $245/year): unlimited checks, AI Listing generation (PT/ES), real-time regulation updates, priority support, batch CSV detection, early access to new markets
- AI Listing generates compliant product listings in Brazilian Portuguese or Mexican Spanish
- Batch detection requires Pro Annual subscription
- 7-day money-back guarantee

Tone: friendly, professional, concise. Answer in the user's language. If asked complex compliance questions, suggest using "Compliance Advisor mode".`

const ADVISOR_SYSTEM_PROMPT = `You are CosmetCheck's AI Compliance Advisor, specializing in Brazilian (ANVISA) and Mexican (COFEPRIS) cosmetics regulations.

Your expertise:
- Analyze product listings for compliance risks
- Interpret ANVISA RDC 751/2022 and COFEPRIS regulations
- Determine if ingredients are permitted in target markets
- Provide modification suggestions and compliant listing copy
- Explain labeling requirements, claim restrictions, banned ingredients

Guidelines:
1. Cite specific regulation articles when possible
2. Give clear, actionable recommendations
3. State severity and consequences for any risks
4. Reply in the user's language
5. Remind users this is reference advice; final compliance responsibility lies with the seller. For major legal decisions, recommend consulting a licensed local attorney.`

function getChatSystemPrompt(mode: ChatMode): string {
  return mode === 'advisor' ? ADVISOR_SYSTEM_PROMPT : SUPPORT_SYSTEM_PROMPT
}

export async function chatWithAI(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  mode: ChatMode = 'support'
): Promise<ReadableStream<Uint8Array>> {
  const primary = getPrimaryProvider()
  const fallback = getFallbackProvider()

  let openai: OpenAI
  let currentProvider: string
  let model: string

  openai = getOpenAIClient(primary)
  currentProvider = primary.provider
  model = primary.model

  const systemPrompt = getChatSystemPrompt(mode)
  const fullMessages = [
    { role: 'system' as const, content: systemPrompt },
    ...messages,
  ]

  const maxTokens = mode === 'advisor' ? 4000 : 2000

  try {
    const response = await withRetry(
      () =>
        openai.chat.completions.create({
          model,
          messages: fullMessages,
          stream: true,
          temperature: 0.7,
          max_tokens: maxTokens,
        }),
      `${currentProvider} chat(${mode})`
    )

    const encoder = new TextEncoder()
    return new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response as unknown as AsyncIterable<{
            choices: Array<{ delta?: { content?: string } }>
          }>) {
            const content = chunk.choices[0]?.delta?.content
            if (content) {
              controller.enqueue(encoder.encode(content))
            }
          }
          controller.close()
        } catch (streamError) {
          controller.error(streamError)
        }
      },
    })
  } catch (error) {
    // Fallback on rate limit or connection error
    const errorMessage = error instanceof Error ? error.message : String(error)
    const isConnectionError =
      errorMessage.includes('fetch failed') ||
      errorMessage.includes('ECONNREFUSED') ||
      errorMessage.includes('ETIMEDOUT') ||
      errorMessage.includes('timeout') ||
      errorMessage.includes('unable to connect') ||
      errorMessage.includes('getaddrinfo') ||
      (typeof (error as Record<string, unknown>).status === 'number' &&
        [429, 500, 502, 503, 504].includes((error as Record<string, unknown>).status as number))

    if ((isRateLimitError(error) || isConnectionError) && fallback) {
      console.warn(`[AI] ${currentProvider} failed for chat, falling back to ${fallback.provider}`)
      openai = getOpenAIClient(fallback)
      currentProvider = fallback.provider
      model = fallback.model

      const fallbackResponse = await openai.chat.completions.create({
        model,
        messages: fullMessages,
        stream: true,
        temperature: 0.7,
        max_tokens: maxTokens,
      })

      const encoder = new TextEncoder()
      return new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of fallbackResponse as unknown as AsyncIterable<{
              choices: Array<{ delta?: { content?: string } }>
            }>) {
              const content = chunk.choices[0]?.delta?.content
              if (content) {
                controller.enqueue(encoder.encode(content))
              }
            }
            controller.close()
          } catch (streamError) {
            controller.error(streamError)
          }
        },
      })
    }

    console.error(`[AI] ${currentProvider} chat failed:`, errorMessage)
    throw error
  }
}