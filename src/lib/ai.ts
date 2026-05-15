import OpenAI from 'openai'

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

// Retry configuration - optimized for DeepSeek/Kimi rate limits
// A+B方案: 增加基础延迟 + 更多重试次数 + 预调用随机等待
export const MAX_RETRIES = 10  // Increased from 8 for more resilience
export const INITIAL_DELAY_MS = 15000  // Start with 15s (was 10s) - 降低请求密度
export const MAX_DELAY_MS = 120000  // Cap at 120s (was 60s) - 给足恢复时间
export const CONSECUTIVE_FAILURES_THRESHOLD = 3  // 连续失败后触发"死慢退避"

// 预调用随机等待 - 消除请求突发
export const PRE_CALL_SLEEP_MIN = 8000  // 8秒 (was 5s)
export const PRE_CALL_SLEEP_MAX = 20000 // 20秒 (was 15s)

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
  if (error && typeof error === 'object') {
    const err = error as Record<string, unknown>
    if (typeof err.response === 'object' && err.response !== null) {
      const resp = err.response as Record<string, unknown>
      if (typeof resp.headers === 'object' && resp.headers !== null) {
        const headers = resp.headers as Record<string, string>
        if (headers['retry-after']) {
          const seconds = parseInt(headers['retry-after'], 10)
          if (!isNaN(seconds)) return seconds * 1000
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
    }>
    warnings: Array<{
      message: string
      suggestion: string
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

function getSystemPrompt(input: GenerateListingInput): string {
  const country = input.targetCountry === 'BR' ? 'Brazil' : 'Mexico'
  const language = input.targetCountry === 'BR' ? 'Brazilian Portuguese (pt-BR)' : 'Mexican Spanish (es-MX)'
  const regulation = input.targetCountry === 'BR' ? 'ANVISA' : 'COFEPRIS'

  let prompt = `You are an expert e-commerce copywriter specializing in Latin American beauty products.

TASK: Generate a high-converting, ${regulation}-compliant product listing for ${country} in ${language}.

RULES:
1. Language: Write ONLY in ${language}. Do not mix languages.
2. Compliance: Follow ${regulation} cosmetic regulations strictly:
   - NO medical/therapeutic claims (no "treats", "cures", "heals", "medicinal")
   - NO absolute claims without proof (no "100% natural", "completely safe")
   - Use only cosmetic claims: moisturizing, cleansing, beautifying, perfuming, protecting
   - Include required disclaimer style if applicable
3. Structure: Provide exactly this JSON format:
   {
     "title": "Product title (max 200 chars, catchy, keyword-rich)",
     "description": "Engaging product description (2-3 paragraphs, 300-500 chars)",
     "bulletPoints": ["5-7 selling points, each 1-2 sentences"],
     "complianceNotes": ["Notes about regulatory compliance"],
     "warnings": ["Any compliance warnings to be aware of"]
   }
4. Tone: ${input.tone || 'professional'}
5. Target audience: Beauty consumers in ${country}
6. Platform style: Adapt for Mercado Livre / Amazon / Shopee style listings

PRODUCT INFO:
- Name: ${input.productName}
- Category: ${input.category}
${input.ingredients ? `- Key Ingredients: ${input.ingredients}` : ''}
${input.benefits ? `- Benefits: ${input.benefits}` : ''}
`

  if (input.checkResult) {
    if (!input.checkResult.isCompliant) {
      prompt += `
COMPLIANCE ISSUES TO AVOID:
${input.checkResult.violations.map(v => `- ${v.message}: ${v.suggestion}`).join('\n')}
${input.checkResult.warnings.map(w => `- Warning: ${w.message}: ${w.suggestion}`).join('\n')}

CRITICAL: Do NOT use any of the problematic ingredients or claims mentioned above in the listing.
`
    }
  }

  prompt += `
Output ONLY valid JSON. No markdown, no explanations outside JSON.`

  return prompt
}

export async function generateListing(
  input: GenerateListingInput
): Promise<GeneratedListing> {
  const openai = getOpenAI()

  const response = await withRetry(
    () =>
      openai.chat.completions.create({
        model: 'deepseek-chat',
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
    'DeepSeek generateListing'
  )

  const content = response.choices[0]?.message?.content
  if (!content) {
    throw new Error('Empty response from OpenAI')
  }

  try {
    const parsed = JSON.parse(content)
    return {
      title: parsed.title || '',
      description: parsed.description || '',
      bulletPoints: Array.isArray(parsed.bulletPoints) ? parsed.bulletPoints : [],
      complianceNotes: Array.isArray(parsed.complianceNotes) ? parsed.complianceNotes : [],
      warnings: Array.isArray(parsed.warnings) ? parsed.warnings : [],
      language: input.targetCountry === 'BR' ? 'pt-BR' : 'es-MX',
    }
  } catch (e) {
    throw new Error('Failed to parse AI response')
  }
}