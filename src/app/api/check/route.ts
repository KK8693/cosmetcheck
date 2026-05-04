import { NextRequest, NextResponse } from 'next/server'
import { checkCompliance } from '@/lib/engine'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ingredients, description, label, country } = body

    if (!country || !['BR', 'MX'].includes(country)) {
      return NextResponse.json(
        { error: 'Invalid country. Must be BR or MX' },
        { status: 400 }
      )
    }

    // Check if any content is provided
    if (!ingredients && !description && !label) {
      return NextResponse.json(
        { error: 'At least one of ingredients, description, or label is required' },
        { status: 400 }
      )
    }

    // Run compliance check
    const result = checkCompliance({
      ingredients,
      description,
      label,
      country,
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Check API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Allow OPTIONS for CORS
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
