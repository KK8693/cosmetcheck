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
    model: 'deepseek-chat',
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
  complianceNotes: string[]
  warnings: string[]
  language: 'pt-BR' | 'es-MX'
}

// Post-processing validation: enforce ingredient honesty and claim-consistency
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

  // 1. INGREDIENT HONESTY CHECK
  // If a banned ingredient is in the formula, verify the listing does NOT falsely deny it
  const allNotes = [...result.complianceNotes, ...result.warnings].join(' ').toLowerCase()
  for (const banned of problematicIngredients) {
    // Check if listing falsely claims the ingredient is NOT present
    const denialPatterns = [
      `não contém ${banned}`,
      `nao contem ${banned}`,
      `sem ${banned}`,
      `livre de ${banned}`,
      `does not contain ${banned}`,
      `free of ${banned}`,
      `no ${banned}`,
      `without ${banned}`,
      `不含${banned}`,
      `无${banned}`,
    ]
    const hasDenial = denialPatterns.some(p => allText.includes(p) || allNotes.includes(p))
    if (hasDenial) {
      // Force-add a correction warning
      const correctionNote = `⚠️ CORREÇÃO DE INGREDIENTE: A fórmula original CONTÉM ${banned}, que é proibido pela ANVISA. Este ingrediente DEVE ser removido antes do lançamento. A listagem não deve negar a presença de ingredientes reais.`
      result.warnings = [correctionNote, ...result.warnings]
      console.warn(`[AI Validate] 🔴 Ingredient honesty violation: listing falsely denies presence of ${banned}`)
    }

    // Also check if the banned ingredient is mentioned AT ALL in the listing
    const mentionedInListing = allText.includes(banned) || allNotes.includes(banned)
    if (!mentionedInListing) {
      // The banned ingredient should be disclosed in complianceNotes
      const disclosureNote = `⚠️ INGREDIENTE PROIBIDO DETECTADO: A fórmula contém ${banned}, que é proibido/restrito pela ANVISA. Este produto NÃO pode ser comercializado no Brasil sem reformulação.`
      result.complianceNotes = [disclosureNote, ...result.complianceNotes]
      console.warn(`[AI Validate] 🔴 Missing disclosure for banned ingredient: ${banned}`)
    }
  }

  // 2. SUNSCREEN CLAIM CONSISTENCY
  // Check if listing claims sun protection but ingredients lack sunscreen actives
  const sunscreenActives = [
    'zinc oxide', 'titanium dioxide', 'avobenzone', 'oxybenzone', 'octinoxate',
    'octocrylene', 'homosalate', 'octisalate', 'ensulizole', 'tinosorb',
    '氧化锌', '氧化钛', '防晒剂', 'avobenzona', 'óxido de zinco', 'dióxido de titânio'
  ]
  const hasSunscreenIngredients = sunscreenActives.some(a => ingredients.includes(a))
  // Expanded regex to catch UV-related claims even without explicit SPF/FPS
  const hasSunscreenClaim =
    /fps\s*\d+|spf\s*\d+|prote[cç][aã]o\s+solar|bloqueador|sunscreen|anti-uv|\bradia[cç][aã]o\s+uv\b|protege[r]?\b.*\buv\b|prote[cç][aã]o\s+.*\buv\b|contra\s+.*\buv\b|efeitos?\s+.*\buv\b|exposi[cç][aã]o\s+.*\buv\b|danos?\s+.*\buv\b|estresse\s+oxidativo\s+.*\buv\b/i.test(allText)

  if (hasSunscreenClaim && !hasSunscreenIngredients) {
    const inconsistencyWarning = `⚠️ INCONSISTÊNCIA: A listagem menciona proteção/efeitos relacionados a UV, mas a fórmula NÃO contém ativos de proteção solar (ex: óxido de zinco, dióxido de titânio, avobenzona). Remova as alegações de proteção UV/SPF/FPS ou adicione ativos de proteção solar à fórmula. Além disso, produtos com proteção UV requerem registro ESPECIAL na ANVISA.`
    result.warnings = [inconsistencyWarning, ...result.warnings]
    console.warn('[AI Validate] 🔴 Sunscreen/UV claim without sunscreen ingredients')
  }

  // 3. SENSITIVE SKIN CLAIM CHECK
  const sensitiveSkinPattern = /todos\s+os\s+tipos\s+de\s+pele.*sens[ií]veis|todos\s+tipos\s+de\s+pele.*inclusive|all\s+skin\s+types.*sensitive|suitable\s+for\s+all\s+skin\s+types/i
  if (sensitiveSkinPattern.test(allText)) {
    const sensitiveWarning = `⚠️ ALEGAÇÃO DE PELE SENSÍVEL: A frase "adequado para todos os tipos de pele, inclusive sensíveis" requer testes dermatológicos comprovados. Recomendado: "adequado para a maioria dos tipos de pele" ou incluir aviso "Teste de toque recomendado para peles sensíveis".`
    result.warnings = [sensitiveWarning, ...result.warnings]
    console.warn('[AI Validate] 🟡 Sensitive skin claim detected')
  }

  // 4. WHITENING/SKIN LIGHTENING REGISTRATION WARNING
  const whiteningPattern = /clareador|clareamento|branqueador|whitening|lightening|desmanchador|anti-manchas\s+intenso/i
  if (whiteningPattern.test(allText)) {
    const whiteningNote = `⚠️ REGISTRO ESPECIAL REQUERIDO: Produtos com alegações de clareamento/branqueamento da pele ("clareador", "anti-manchas intensivo") requerem registro ESPECIAL na ANVISA, além da notificação cosmética normal. O processo é mais longo e exige estudos de segurança adicionais.`
    // Check if already mentioned
    const alreadyMentioned = result.complianceNotes.some(n => n.toLowerCase().includes('registro especial') && n.toLowerCase().includes('clareamento'))
    if (!alreadyMentioned) {
      result.complianceNotes = [whiteningNote, ...result.complianceNotes]
      console.warn('[AI Validate] 🟡 Whitening claim - special registration required')
    }
  }

  return result
}

function getSystemPrompt(input: GenerateListingInput): string {
  const country = input.targetCountry === 'BR' ? 'Brazil' : 'Mexico'
  const language = input.targetCountry === 'BR' ? 'Brazilian Portuguese (pt-BR)' : 'Mexican Spanish (es-MX)'
  const regulation = input.targetCountry === 'BR' ? 'ANVISA' : 'COFEPRIS'

  // Extract problematic ingredients from checkResult
  const problematicIngredients: string[] = []
  const problematicClaims: string[] = []
  if (input.checkResult) {
    for (const v of input.checkResult.violations) {
      if (v.category === 'ingredient' && v.keyword) {
        problematicIngredients.push(v.keyword)
      }
      if ((v.category === 'claim' || v.category === 'label') && v.keyword) {
        problematicClaims.push(v.keyword)
      }
    }
    for (const w of input.checkResult.warnings) {
      if (w.category === 'ingredient' && w.keyword) {
        problematicIngredients.push(w.keyword)
      }
      if ((w.category === 'claim' || w.category === 'label') && w.keyword) {
        problematicClaims.push(w.keyword)
      }
    }
  }

  let prompt = `You are an expert e-commerce copywriter specializing in Latin American beauty products.

TASK: Generate a high-converting, ${regulation}-compliant product listing for ${country} in ${language}.

CRITICAL RULES (violating any will cause regulatory penalties):

1. LANGUAGE: Write ONLY in ${language}. Do not mix languages.

2. INGREDIENT HONESTY (MOST IMPORTANT):
   - You MUST truthfully reflect ALL ingredients provided by the user
   - NEVER falsely claim a banned/restricted ingredient is "not present" when it IS in the formula
   - For PROHIBITED ingredients (completely banned in cosmetics), use STRONG language in complianceNotes:
     CORRECT: "🔴 [ingredient] é PROIBIDO em cosméticos pela ANVISA. Este produto NÃO pode ser comercializado sem reformulação."
     WRONG: "⚠️ [ingredient] é substância controlada" (too weak, implies it might be allowed)
   - For antibiotics (metronidazol, etc.), state clearly: "🔴 [ingredient] é um antibiótico PROIBIDO em cosméticos"
   - NEVER use prohibited ingredients in the product TITLE as selling points
   - Example correct title: "Sérum Hidratante Clareador" (no banned ingredients mentioned)
   - Example WRONG title: "Sérum com Ácido Retinoico" (banned ingredient in title!)
   - Do NOT lie about ingredients.

3. CLAIM-INGREDIENT CONSISTENCY:
   - NEVER claim sun protection or UV defense (SPF/FPS/UV protection/anti-UV/radiação UV) unless the ingredient list contains sunscreen actives (zinc oxide, titanium dioxide, avobenzone, etc.)
   - If NO sunscreen actives are present but user mentions UV/sun protection, do NOT include any UV-related claims in the title, description, or bullet points
   - Only list benefits that are supported by the actual ingredients provided

4. SPECIAL PRODUCT REGISTRATION WARNINGS:
   - If the product claims skin lightening/whitening ("clareador", "clareamento", "branqueador"), it requires SPECIAL registration with ${regulation} beyond normal cosmetic notification
   - If the product claims sun protection (SPF/FPS/UV), it requires SPECIAL registration with ${regulation}
   - These claims MUST be flagged in complianceNotes with: "⚠️ Requires special ${regulation} registration for [whitening/sun protection] products"

5. SENSITIVE SKIN CLAIMS:
   - Do NOT claim "suitable for all skin types including sensitive skin" ("indicado para todos os tipos de pele, inclusive sensíveis")
   - Do NOT claim "todos os tipos de pele" (all skin types) anywhere in bullet points
   - Instead use softer language: "suitable for most skin types" or "gentle formula"
   - If you mention sensitive skin, add a warning: "Patch test recommended for sensitive skin"

6. COMPLIANCE - ${regulation} regulations:
   - NO medical/therapeutic claims (no "treats", "cures", "heals", "medicinal", "medical grade")
   - NO anti-aging claims as primary selling point (no "anti-idade", "anti-envelhecimento" in title)
   - Instead use: "para pele madura" or "reduz a aparência de linhas finas"
   - NO absolute claims without proof (no "100%", "completely", "totally", "zero", "permanent", "forever")
   - NO specific time-based results (no "7 days", "instant", "immediate", "24 hours", "28 days")
   - NO safety claims about pregnancy or children without clinical proof
   - Use only cosmetic claims: moisturizing, cleansing, beautifying, perfuming, protecting
   - Use hedging language: "helps to", "promotes", "assists in", "reduces the appearance of"

7. Structure: Provide exactly this JSON format:
   {
     "title": "Product title (max 200 chars, catchy, keyword-rich, NO banned terms)",
     "description": "Engaging product description (2-3 paragraphs, 300-500 chars)",
     "bulletPoints": ["5-7 selling points, each 1-2 sentences"],
     "complianceNotes": ["Notes about regulatory compliance, ingredient honesty, and registration requirements"],
     "warnings": ["Any compliance warnings to be aware of"]
   }

8. Tone: ${input.tone || 'professional'}
9. Target audience: Beauty consumers in ${country}
10. Platform style: Adapt for Mercado Livre / Amazon / Shopee style listings

PRODUCT INFO:
- Name: ${input.productName}
- Category: ${input.category}
${input.ingredients ? `- Key Ingredients: ${input.ingredients}` : ''}
${input.benefits ? `- Benefits: ${input.benefits}` : ''}
`

  if (input.checkResult) {
    if (!input.checkResult.isCompliant) {
      prompt += `
COMPLIANCE ISSUES DETECTED:
${input.checkResult.violations.map(v => `- [${v.severity?.toUpperCase() || 'VIOLATION'}] ${v.category?.toUpperCase() || 'GENERAL'}: ${v.message} (${v.suggestion})`).join('\n')}
${input.checkResult.warnings.map(w => `- [WARNING] ${w.category?.toUpperCase() || 'GENERAL'}: ${w.message} (${w.suggestion})`).join('\n')}
`
      if (problematicIngredients.length > 0) {
        prompt += `
BANNED/RESTRICTED INGREDIENTS IN FORMULA (MUST be listed honestly with warnings):
${problematicIngredients.map(i => `- ${i}`).join('\n')}
DO NOT claim these are "not present" - they ARE in the formula and must be disclosed.
`
      }
      if (problematicClaims.length > 0) {
        prompt += `
PROBLEMATIC CLAIMS TO AVOID:
${problematicClaims.map(c => `- ${c}`).join('\n')}
`
      }
    }
  }

  prompt += `
Output ONLY valid JSON. No markdown, no explanations outside JSON.`

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
    const rawListing: GeneratedListing = {
      title: parsed.title || '',
      description: parsed.description || '',
      bulletPoints: Array.isArray(parsed.bulletPoints) ? parsed.bulletPoints : [],
      complianceNotes: Array.isArray(parsed.complianceNotes) ? parsed.complianceNotes : [],
      warnings: Array.isArray(parsed.warnings) ? parsed.warnings : [],
      language: input.targetCountry === 'BR' ? 'pt-BR' : 'es-MX',
    }
    // Post-process: enforce ingredient honesty and claim-consistency
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
      const rawFallbackListing: GeneratedListing = {
        title: parsedFallback.title || '',
        description: parsedFallback.description || '',
        bulletPoints: Array.isArray(parsedFallback.bulletPoints) ? parsedFallback.bulletPoints : [],
        complianceNotes: Array.isArray(parsedFallback.complianceNotes) ? parsedFallback.complianceNotes : [],
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
      const rawConnListing: GeneratedListing = {
        title: parsedConn.title || '',
        description: parsedConn.description || '',
        bulletPoints: Array.isArray(parsedConn.bulletPoints) ? parsedConn.bulletPoints : [],
        complianceNotes: Array.isArray(parsedConn.complianceNotes) ? parsedConn.complianceNotes : [],
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