import { NextRequest, NextResponse } from 'next/server'
import { generateListing } from '@/lib/ai'
import { moderateContent, getModerationWarnings } from '@/lib/moderation'
import { checkQuotaMiddleware, incrementQuota } from '@/lib/quota'
import { checkRateLimit } from '@/lib/rate-limit'
import { checkListingAccess } from '@/lib/subscription'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

// Create Supabase client for server-side
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(supabaseUrl, supabaseKey)
}

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID()
  const startTime = Date.now()
  
  // Extract identity info for tracing
  const userEmail = request.headers.get('x-user-email')
  const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'anonymous'
  const identifier = userEmail || clientIp

  try {
    // Pro subscription check: Listing generation is Pro-only
    if (!userEmail) {
      console.log(`[Generate:${requestId}] REJECTED auth missing | ip=${clientIp}`)
      return NextResponse.json(
        { error: 'Login required', message: 'Please sign in to generate listings.', upgradeUrl: '/pricing' },
        { status: 403 }
      )
    }

    const { allowed, tier, reason } = await checkListingAccess(userEmail)
    if (!allowed) {
      console.log(`[Generate:${requestId}] REJECTED subscription | user=${userEmail} tier=${tier} reason=${reason}`)
      return NextResponse.json(
        {
          error: 'Pro subscription required',
          message: 'AI Listing generation is a Pro feature. Upgrade to unlock unlimited AI-powered listing creation.',
          tier,
          reason,
          upgradeUrl: '/pricing',
        },
        { status: 403 }
      )
    }

    // Check quota first
    const quotaCheck = await checkQuotaMiddleware(request)
    if (!quotaCheck.allowed) {
      console.log(`[Generate:${requestId}] REJECTED quota | user=${userEmail}`)
      return quotaCheck.response!
    }

    // Rate limit check (token bucket, 10 req/min)
    const rateLimitResult = await checkRateLimit(identifier)
    
    if (!rateLimitResult.allowed) {
      console.log(`[Generate:${requestId}] REJECTED rateLimit | user=${userEmail} retryAfter=${rateLimitResult.retryAfterMs}ms`)
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded', 
          retryAfterSeconds: Math.ceil((rateLimitResult.retryAfterMs || 60000) / 1000),
          remaining: 0,
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimitResult.retryAfterMs || 60000) / 1000)),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rateLimitResult.resetInMs),
          }
        }
      )
    }

    const body = await request.json()
    const { productName, ingredients, benefits, category, targetCountry, tone, checkResult } = body

    // Validation
    if (!productName || typeof productName !== 'string') {
      console.log(`[Generate:${requestId}] REJECTED badRequest | user=${userEmail} missing=productName`)
      return NextResponse.json(
        { error: 'productName is required' },
        { status: 400 }
      )
    }

    if (!targetCountry || !['BR', 'MX'].includes(targetCountry)) {
      console.log(`[Generate:${requestId}] REJECTED badRequest | user=${userEmail} invalid=targetCountry`)
      return NextResponse.json(
        { error: 'targetCountry must be BR or MX' },
        { status: 400 }
      )
    }

    if (!category || !['skincare', 'makeup', 'haircare', 'fragrance', 'bodycare'].includes(category)) {
      console.log(`[Generate:${requestId}] REJECTED badRequest | user=${userEmail} invalid=category`)
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      )
    }

    // Check if AI API key is configured
    const apiKey = process.env.OPENAI_API_KEY || process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
      console.error(`[Generate:${requestId}] ERROR noApiKey | user=${userEmail}`)
      return NextResponse.json(
        { error: 'AI generation service is not configured' },
        { status: 503 }
      )
    }

    console.log(`[Generate:${requestId}] START | user=${userEmail} country=${targetCountry} category=${category} product="${productName.substring(0, 50)}"`)

    const genStart = Date.now()
    const result = await generateListing({
      productName,
      ingredients,
      benefits,
      category,
      targetCountry,
      tone,
      checkResult,
    })
    const genDuration = Date.now() - genStart
    console.log(`[Generate:${requestId}] GENERATE_OK | duration=${genDuration}ms user=${userEmail} country=${targetCountry}`)

    // Increment quota after successful generation
    await incrementQuota(identifier)

    // Moderate AI-generated output
    const modStart = Date.now()
    const outputText = `${result.title} ${result.description} ${result.bulletPoints.join(' ')}`
    const outputModeration = await moderateContent(outputText)
    const modDuration = Date.now() - modStart
    console.log(`[Generate:${requestId}] MODERATE_OK | duration=${modDuration}ms flagged=${outputModeration.flagged} user=${userEmail}`)
    
    const totalDuration = Date.now() - startTime
    
    if (outputModeration.flagged) {
      const warnings = getModerationWarnings(outputModeration)
      console.warn(`[Generate:${requestId}] COMPLETE_WITH_WARNING | total=${totalDuration}ms user=${userEmail} warnings=${warnings.join(';')}`)
      return NextResponse.json({
        success: true,
        data: result,
        warning: 'AI-generated content requires manual review',
        moderationWarnings: warnings,
      })
    }

    console.log(`[Generate:${requestId}] COMPLETE | total=${totalDuration}ms user=${userEmail} country=${targetCountry}`)
    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Generate API error:', error)

    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined

    if (
      errorMessage.includes('API_KEY is not configured') ||
      errorMessage.includes('No AI provider configured') ||
      errorMessage.includes('Incorrect API key')
    ) {
      console.error('[Generate] 🔴 AI Provider Auth Error:', { message: errorMessage, stack: errorStack })
      return NextResponse.json(
        { error: 'AI generation service is not configured correctly', details: 'Invalid or missing AI API key. Please contact support.' },
        { status: 503 }
      )
    }

    if (
      errorMessage.includes('fetch failed') ||
      errorMessage.includes('ECONNREFUSED') ||
      errorMessage.includes('ETIMEDOUT') ||
      errorMessage.includes('timeout') ||
      errorMessage.includes('network') ||
      errorMessage.includes('unable to connect')
    ) {
      console.error('[Generate] 🔴 AI Provider Network Error:', { message: errorMessage, stack: errorStack })
      return NextResponse.json(
        { error: 'AI generation service temporarily unavailable', details: 'Network error connecting to AI provider. Please retry in a moment.' },
        { status: 504 }
      )
    }

    if (
      errorMessage.includes('JSON') ||
      errorMessage.includes('Empty response') ||
      errorMessage.includes('Unexpected token')
    ) {
      console.error('[Generate] 🔴 AI Response Parsing Error:', { message: errorMessage, stack: errorStack })
      return NextResponse.json(
        { error: 'AI generated invalid response', details: 'The AI provider returned an unexpected format. Please retry.' },
        { status: 502 }
      )
    }

    console.error('[Generate] 🔴 Unknown Server Error:', { message: errorMessage, stack: errorStack })
    return NextResponse.json(
      { error: 'Failed to generate listing', details: errorMessage },
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
