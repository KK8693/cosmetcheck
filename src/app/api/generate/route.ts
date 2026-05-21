import { NextRequest, NextResponse } from 'next/server'
import { generateListing } from '@/lib/ai'
import { moderateContent, getModerationWarnings } from '@/lib/moderation'
import { checkQuotaMiddleware, incrementQuota } from '@/lib/quota'
import { checkRateLimit } from '@/lib/rate-limit'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

// Create Supabase client for server-side
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(supabaseUrl, supabaseKey)
}

export async function POST(request: NextRequest) {
  try {
    // Check quota first
    const quotaCheck = await checkQuotaMiddleware(request)
    if (!quotaCheck.allowed) {
      return quotaCheck.response!
    }

    // Rate limit check (token bucket, 10 req/min)
    const userEmail = request.headers.get('x-user-email')
    const identifier = userEmail ||
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'anonymous'

    const rateLimitResult = await checkRateLimit(identifier)
    
    if (!rateLimitResult.allowed) {
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

    // Check if AI API key is configured
    const apiKey = process.env.OPENAI_API_KEY || process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI generation service is not configured' },
        { status: 503 }
      )
    }

    // Moderate user input before generation
    const userInput = `${productName} ${ingredients || ''} ${benefits || ''}`
    const inputModeration = await moderateContent(userInput)
    
    if (inputModeration.flagged) {
      const warnings = getModerationWarnings(inputModeration)
      return NextResponse.json(
        { error: 'Content violates our usage policy', details: warnings },
        { status: 400 }
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

    // Increment quota after successful generation
    await incrementQuota(identifier)

    // Moderate AI-generated output
    const outputText = `${result.title} ${result.description} ${result.bulletPoints.join(' ')}`
    const outputModeration = await moderateContent(outputText)
    
    if (outputModeration.flagged) {
      const warnings = getModerationWarnings(outputModeration)
      console.warn('AI output flagged:', warnings)
      // Log but don't block - let user review with warning
      return NextResponse.json({
        success: true,
        data: result,
        warning: 'AI-generated content requires manual review',
        moderationWarnings: warnings,
      })
    }

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Generate API error:', error)

    // 错误分类：让后端日志和前端都能明确知道是哪一层坏了
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined

    // 1. 检测 AI provider 配置问题（key 无效/缺失）
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

    // 2. 检测 AI provider 连接/网络问题
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

    // 3. 检测 AI 响应格式问题（JSON 解析失败、空响应）
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

    // 4. 默认：未知服务端错误
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
