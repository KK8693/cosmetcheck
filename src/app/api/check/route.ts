import { NextRequest, NextResponse } from 'next/server'
import { checkCompliance, initRules } from '@/lib/engine'
import { checkQuotaMiddleware, incrementQuota } from '@/lib/quota'

import { translateCheckResult } from '@/lib/regulation-messages'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    // Ensure rules are loaded before processing
    await initRules()

    // Check quota
    const quotaResult = await checkQuotaMiddleware(request)
    if (!quotaResult.allowed) {
      return quotaResult.response
    }

    const body = await request.json()
    const { ingredients, description, label, country, locale = 'en' } = body

    if (!country || !['BR', 'MX'].includes(country)) {
      return NextResponse.json(
        { error: 'Invalid country. Must be BR or MX' },
        { status: 400 }
      )
    }

    if (!ingredients && !description && !label) {
      return NextResponse.json(
        { error: 'At least one of ingredients, description, or label is required' },
        { status: 400 }
      )
    }

    // Increment quota
    const identifier =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'anonymous'
    await incrementQuota(identifier)

    // Run compliance check
    const result = checkCompliance({
      ingredients,
      description,
      label,
      country,
    })

    // Translate results to requested locale
    const translatedResult = {
      ...result,
      violations: translateCheckResult(result.violations, locale),
      warnings: translateCheckResult(result.warnings, locale),
      info: translateCheckResult(result.info, locale),
    }

    return NextResponse.json({
      success: true,
      data: translatedResult,
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
