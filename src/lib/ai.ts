import OpenAI from 'openai'

function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured')
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
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
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
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
