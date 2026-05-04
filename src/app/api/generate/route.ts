import { NextRequest, NextResponse } from 'next/server'
import { generateListing } from '@/lib/ai'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productName, ingredients, benefits, category, targetCountry, tone, checkResult } = body

    // Validation
    if (!productName || typeof productName !== 'string') {
      return NextResponse.json(
        { error: 'productName is required' },
        { status: 400 }
      )
    }

    if (!targetCountry || !['BR', 'MX'].includes(targetCountry)) {
      return NextResponse.json(
        { error: 'targetCountry must be BR or MX' },
        { status: 400 }
      )
    }

    if (!category || !['skincare', 'makeup', 'haircare', 'fragrance', 'bodycare'].includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      )
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'AI generation service is not configured' },
        { status: 503 }
      )
    }

    const result = await generateListing({
      productName,
      ingredients,
      benefits,
      category,
      targetCountry,
      tone,
      checkResult,
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Generate API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate listing' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
