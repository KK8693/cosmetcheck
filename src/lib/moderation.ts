/**
 * AI Content Moderation utilities
 * Uses OpenAI Moderation API to check user inputs and AI outputs
 */

interface ModerationResult {
  flagged: boolean
  categories: Record<string, boolean>
  categoryScores: Record<string, number>
}

/**
 * Check content using OpenAI Moderation API
 * @param text - Content to check
 * @returns Moderation result with flagged status and category details
 */
export async function moderateContent(text: string): Promise<ModerationResult> {
  try {
    const response = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({ input: text }),
    })

    if (!response.ok) {
      console.error('Moderation API error:', response.statusText)
      // Don't block on moderation API failure - return safe default
      return { flagged: false, categories: {}, categoryScores: {} }
    }

    const data = await response.json()
    const result = data.results[0]

    return {
      flagged: result.flagged,
      categories: result.categories,
      categoryScores: result.category_scores,
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