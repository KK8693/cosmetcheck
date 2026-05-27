import { NextRequest, NextResponse } from 'next/server'
import { checkCompliance, initRules } from '@/lib/engine'
import { checkQuotaMiddleware, incrementQuota, getQuotaStatus } from '@/lib/quota'
import { trackAnalysisComplete } from '@/lib/analytics-server'
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

    // Get updated quota status for response
    const quotaStatus = await getQuotaStatus(identifier)

    // Run compliance check
    const result = checkCompliance({
      ingredients,
      description,
      label,
      country,
    })

    // Determine result status
    const resultStatus: 'pass' | 'fail' | 'warn' =
      result.violations.length > 0 ? 'fail' : result.warnings.length > 0 ? 'warn' : 'pass'

    // Track analysis completion (non-blocking)
    const userId = request.headers.get('x-user-id') || undefined
    trackAnalysisComplete(request, country as 'BR' | 'MX', resultStatus, userId).catch(() => {
      // silently fail
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
      quota: {
        used: quotaStatus.used,
        limit: quotaStatus.limit,
        remaining: quotaStatus.remaining,
      },
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
