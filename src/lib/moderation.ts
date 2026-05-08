/**
 * AI Content Moderation utilities
 * Uses DeepSeek/OpenAI Moderation API to check user inputs and AI outputs
 */

interface ModerationResult {
  flagged: boolean
  categories: Record<string, boolean>
  categoryScores: Record<string, number>
}

/**
 * Check content using DeepSeek/OpenAI Moderation API
 * @param text - Content to check
 * @returns Moderation result with flagged status and category details
 */
export async function moderateContent(text: string): Promise<ModerationResult> {
  // Use DeepSeek if available, otherwise skip moderation (fail open)
  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY
  if (!apiKey) {
    return { flagged: false, categories: {}, categoryScores: {} }
  }

  try {
    const isDeepSeek = !!process.env.DEEPSEEK_API_KEY
    
    if (isDeepSeek) {
      // Use DeepSeek's built-in moderation via chat API
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'You are a content moderation assistant. Analyze the following text for any policy violations including hate speech, harassment, sexual content, violence, self-harm, or illegal content. Respond with ONLY a JSON object: {"flagged": true/false, "reason": "brief reason if flagged"}'
            },
            {
              role: 'user',
              content: text
            }
          ],
          max_tokens: 200
        }),
      })

      if (!response.ok) {
        console.error('DeepSeek moderation error:', response.statusText)
        return { flagged: false, categories: {}, categoryScores: {} }
      }

      const data = await response.json()
      const content = data.choices?.[0]?.message?.content || ''
      
      try {
        const parsed = JSON.parse(content)
        return { 
          flagged: parsed.flagged || false, 
          categories: parsed.flagged ? { 'policy': true } : {}, 
          categoryScores: {} 
        }
      } catch {
        return { flagged: false, categories: {}, categoryScores: {} }
      }
    } else {
      // Use OpenAI Moderation API
      const response = await fetch('https://api.openai.com/v1/moderations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ input: text }),
      })

      if (!response.ok) {
        console.error('Moderation API error:', response.statusText)
        return { flagged: false, categories: {}, categoryScores: {} }
      }

      const data = await response.json()
      const result = data.results[0]

      return {
        flagged: result.flagged,
        categories: result.categories,
        categoryScores: result.category_scores,
      }
    }
  } catch (error) {
    console.error('Moderation check failed:', error)
    // Fail open - don't block content on API errors
    return { flagged: false, categories: {}, categoryScores: {} }
  }
}

/**
 * Check both user input and generated output for safety
 * @param userInput - Original user product information
 * @param generatedOutput - AI generated content
 * @returns Object with separate moderation results
 */
export async function moderateContentPair(
  userInput: string,
  generatedOutput: string
): Promise<{
  input: ModerationResult
  output: ModerationResult
}> {
  const [inputResult, outputResult] = await Promise.all([
    moderateContent(userInput),
    moderateContent(generatedOutput),
  ])

  return {
    input: inputResult,
    output: outputResult,
  }
}

/**
 * Get human-readable category warnings from moderation result
 * @param result - Moderation result
 * @returns Array of warning strings
 */
export function getModerationWarnings(result: ModerationResult): string[] {
  const warnings: string[] = []
  const categories: Record<string, string> = {
    'hate': 'Hate speech detected',
    'hate/threatening': 'Threatening content detected',
    'harassment': 'Harassment detected',
    'harassment/threatening': 'Threatening harassment detected',
    'self-harm': 'Self-harm content detected',
    'self-harm/intent': 'Self-harm intent detected',
    'self-harm/instructions': 'Self-harm instructions detected',
    'sexual': 'Sexual content detected',
    'sexual/minors': 'Sexual content involving minors detected',
    'violence': 'Violence detected',
    'violencegraphic': 'Graphic violence detected',
  }

  for (const [category, flagged] of Object.entries(result.categories)) {
    if (flagged && categories[category]) {
      warnings.push(categories[category])
    }
  }

  return warnings
}