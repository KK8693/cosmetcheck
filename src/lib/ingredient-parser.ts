/**
 * CosmetCheck Ingredient Parser
 * 成分解析服务 - 拆分 + 标准化
 * 
 * 功能：
 * 1. 将成分字符串拆分为独立成分列表
 * 2. 标准化成分名称（匹配INCI词库）
 * 3. 返回标准化的成分对象列表
 */

import inciDictionary from '../data/ingredients/inci-dictionary.json' with { type: 'json' }

// INCI词库类型定义
interface InciEntry {
  inci: string
  aliases: string[]
  category: string
  prohibited?: boolean
  restricted?: boolean
  hasConcentration?: boolean
}

interface InciDictionary {
  version: string
  description: string
  source: string
  totalCount: number
  entries: Record<string, InciEntry>
}

export interface ParsedIngredient {
  original: string           // 原始输入
  normalized: string         // 标准化后的名称
  inci: string               // INCI标准名称
  category: string           // 成分类别
  isProhibited?: boolean     // 是否为禁用成分
  isRestricted?: boolean     // 是否为限用成分
  hasConcentration?: boolean // 是否需要标注浓度
  matchedBy: 'inci' | 'alias' | 'fuzzy'  // 匹配方式
  confidence: number         // 匹配置信度 0-1
}

export interface ParseResult {
  original: string
  parsed: ParsedIngredient[]
  unparsed: string[]         // 无法匹配的成分
  statistics: {
    total: number
    matched: number
    unmatched: number
    prohibited: number
    restricted: number
  }
}

// 构建别名到标准key的映射
const aliasToKey = new Map<string, string>()
const keyToEntry = new Map<string, InciEntry>()

// 初始化映射表
function initMappings() {
  if (aliasToKey.size > 0) return // 已初始化
  
  const entries = inciDictionary.entries as Record<string, InciEntry>
  for (const [key, entry] of Object.entries(entries)) {
    keyToEntry.set(key, entry)
    
    // 匹配INCI名称
    if (entry.inci) {
      aliasToKey.set(entry.inci.toLowerCase(), key)
      aliasToKey.set(entry.inci.toLowerCase().replace(/\s+/g, ''), key)
    }
    
    // 匹配别名
    if (entry.aliases && Array.isArray(entry.aliases)) {
      for (const alias of entry.aliases) {
        const normalizedAlias = alias.toLowerCase().trim()
        if (normalizedAlias) {
          // 优先精确匹配，相同别名覆盖
          aliasToKey.set(normalizedAlias, key)
          // 也添加无空格版本
          aliasToKey.set(normalizedAlias.replace(/\s+/g, ''), key)
        }
      }
    }
  }
}

// 成分拆分模式 - 支持中英葡西多语言
const SPLIT_PATTERNS = [
  /,\s*/g,                           // 逗号分割 "Water, Glycerin"
  /\s*;\s*/g,                        // 分号分割
  /\s*\|\s*/g,                       // 竖线分割
  /\n/g,                              // 换行分割
  /(?<!\d)\s*\/\s*(?!\d)/g,         // 斜杠分割（非数字前后）
  /(?<!\w)[\u3000\u2000-\u200b]+\s*/g, // 中文全角空格等分隔
  /(?<!\w)[\u0020]+\s*/g,           // 英文空格
]

/**
 * 拆分成分字符串 - 支持多语言
 */
export function splitIngredients(ingredientString: string): string[] {
  if (!ingredientString || typeof ingredientString !== 'string') {
    return []
  }

  let parts = [ingredientString]
  
  for (const pattern of SPLIT_PATTERNS) {
    const newParts: string[] = []
    for (const part of parts) {
      const matches = part.split(pattern)
      newParts.push(...matches)
    }
    parts = newParts
  }

  // 清理每个成分
  const cleaned = parts
    .map(p => p.trim())
    .filter(p => p.length > 0)
    .map(p => p.replace(/^[\d\.\)\]\-\*\•\·\▪\▫]+\s*/, '')) // 去除前导数字/符号
    .map(p => p.replace(/\s+/g, ' ')) // 多空格变单空格
    .filter(p => p.length > 0 && p.length < 100) // 过滤异常长/短的

  // 去重但保持顺序
  const seen = new Set<string>()
  const result: string[] = []
  for (const p of cleaned) {
    if (!seen.has(p)) {
      seen.add(p)
      result.push(p)
    }
  }
  
  return result
}

/**
 * 标准化单个成分
 */
export function normalizeIngredient(input: string): ParsedIngredient {
  initMappings()
  
  const normalizedInput = input.toLowerCase().trim()
  const noSpaceInput = normalizedInput.replace(/\s+/g, '')
  
  // 1. 精确匹配INCI名称
  let matchedKey = aliasToKey.get(normalizedInput)
  
  // 2. 尝试无空格匹配
  if (!matchedKey) {
    matchedKey = aliasToKey.get(noSpaceInput)
  }
  
  // 3. 模糊匹配（包含关系）
  if (!matchedKey) {
    for (const [alias, key] of aliasToKey.entries()) {
      if (normalizedInput.includes(alias) || alias.includes(normalizedInput)) {
        if (alias.length >= 3) { // 避免太短的别名误匹配
          matchedKey = key
          break
        }
      }
    }
  }
  
  // 如果找到匹配
  if (matchedKey) {
    const entry = keyToEntry.get(matchedKey)!
    return {
      original: input,
      normalized: matchedKey,
      inci: entry.inci || matchedKey,
      category: entry.category || 'unknown',
      isProhibited: entry.prohibited === true,
      isRestricted: entry.restricted === true,
      hasConcentration: entry.hasConcentration === true,
      matchedBy: entry.inci?.toLowerCase() === normalizedInput ? 'inci' : 'alias',
      confidence: 0.9
    }
  }
  
  // 未找到匹配，返回原始信息
  return {
    original: input,
    normalized: input,
    inci: input,
    category: 'unknown',
    matchedBy: 'fuzzy',
    confidence: 0
  }
}

/**
 * 解析完整成分字符串
 */
export function parseIngredients(ingredientString: string): ParseResult {
  const parts = splitIngredients(ingredientString)
  const parsed: ParsedIngredient[] = []
  const unparsed: string[] = []
  
  for (const part of parts) {
    const normalized = normalizeIngredient(part)
    parsed.push(normalized)
    
    if (normalized.confidence === 0) {
      unparsed.push(part)
    }
  }
  
  const statistics = {
    total: parsed.length,
    matched: parsed.length - unparsed.length,
    unmatched: unparsed.length,
    prohibited: parsed.filter(p => p.isProhibited).length,
    restricted: parsed.filter(p => p.isRestricted).length
  }
  
  return {
    original: ingredientString,
    parsed,
    unparsed,
    statistics
  }
}

/**
 * 获取所有已知的成分key列表
 */
export function getKnownIngredients(): string[] {
  initMappings()
  return Array.from(keyToEntry.keys())
}

/**
 * 获取成分类别统计
 */
export function getCategoryStatistics(ingredients: ParsedIngredient[]): Record<string, number> {
  const stats: Record<string, number> = {}
  
  for (const ing of ingredients) {
    const cat = ing.category
    stats[cat] = (stats[cat] || 0) + 1
  }
  
  return stats
}

// 导出常用工具
export default {
  splitIngredients,
  normalizeIngredient,
  parseIngredients,
  getKnownIngredients,
  getCategoryStatistics
}