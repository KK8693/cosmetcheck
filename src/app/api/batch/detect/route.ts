import { NextRequest, NextResponse } from 'next/server'
import { checkCompliance } from '@/lib/engine'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { checkBatchAccess } from '@/lib/subscription'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Lazy initialization for Edge Runtime compatibility
let _supabase: SupabaseClient | null = null
let _supabaseAdmin: SupabaseClient | null = null

function getSupabase(): SupabaseClient {
  if (!_supabase) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables')
    }
    _supabase = createClient(supabaseUrl, supabaseAnonKey)
  }
  return _supabase
}

function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables')
    }
    _supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
  }
  return _supabaseAdmin
}

export const runtime = 'edge'

interface BatchItem {
  productId?: string
  text: string
  country: 'BR' | 'MX'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items } = body as { items: BatchItem[] }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items array is required and must not be empty' },
        { status: 400 }
      )
    }

    // Limit batch size
    if (items.length > 100) {
      return NextResponse.json(
        { error: 'Maximum 100 items per batch' },
        { status: 400 }
      )
    }

    // Check Pro subscription - accept email from header or body
    const userEmail = request.headers.get('x-user-email') || body.userEmail
    if (userEmail) {
      const { allowed, tier } = await checkBatchAccess(userEmail)
      if (!allowed) {
        return NextResponse.json(
          {
            error: 'Pro subscription required',
            message: '批量检测功能仅限 Pro 用户使用。请先升级到 Pro 套餐。',
            tier,
            upgradeUrl: '/pricing',
          },
          { status: 403 }
        )
      }
    } else {
      // No email provided, check IP-based quota fallback for free users
      // For now, allow up to 5 items for anonymous users
      if (items.length > 5) {
        return NextResponse.json(
          {
            error: 'Pro subscription required for large batches',
            message: '批量检测超过 5 条需要 Pro 订阅。请升级到 Pro 套餐获取无限批量检测。',
            upgradeUrl: '/pricing',
          },
          { status: 403 }
        )
      }
    }

    // Create batch task (use admin client to bypass RLS)
    const { data: task, error: taskError } = await getSupabaseAdmin()
      .from('batch_tasks')
      .insert({
        task_type: 'detect',
        total_count: items.length,
        status: 'processing',
      })
      .select()
      .single()

    if (taskError || !task) {
      console.error('Failed to create batch task:', taskError)
      return NextResponse.json(
        { error: 'Failed to create batch task' },
        { status: 500 }
      )
    }

    // Process each item
    const results = []
    let completedCount = 0
    let passedCount = 0
    let failedCount = 0
    let criticalCount = 0
    let warningCount = 0
    let infoCount = 0

    for (let i = 0; i < items.length; i++) {
      const item = items[i]

      // Run compliance check using the text as description
      const result = checkCompliance({
        ingredients: '',
        description: item.text,
        label: '',
        country: item.country,
      })

      const isCompliant = result.isCompliant
      const violationCount = result.summary.totalIssues

      // Count severities
      const itemCritical = result.summary.criticalCount
      const itemWarning = result.summary.warningCount
      const itemInfo = result.summary.infoCount

      criticalCount += itemCritical
      warningCount += itemWarning
      infoCount += itemInfo

      if (isCompliant) {
        passedCount++
      } else {
        failedCount++
      }
      completedCount++

      // Store result (use admin client to bypass RLS)
      const { error: resultError } = await getSupabaseAdmin()
        .from('batch_results')
        .insert({
          task_id: task.id,
          row_index: i,
          product_id: item.productId || null,
          original_text: item.text,
          country: item.country,
          is_compliant: isCompliant,
          violations: JSON.stringify(result.violations),
        })

      if (resultError) {
        console.error('Failed to store batch result:', resultError)
      }

      results.push({
        index: i,
        productId: item.productId,
        isCompliant,
        violations: result.violations,
        summary: result.summary,
      })
    }

    // Update task with final counts (use admin client to bypass RLS)
    await getSupabaseAdmin()
      .from('batch_tasks')
      .update({
        completed_count: completedCount,
        passed_count: passedCount,
        failed_count: failedCount,
        critical_count: criticalCount,
        warning_count: warningCount,
        info_count: infoCount,
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', task.id)

    return NextResponse.json({
      success: true,
      data: {
        taskId: task.id,
        totalCount: items.length,
        completedCount,
        passedCount,
        failedCount,
        criticalCount,
        warningCount,
        infoCount,
        status: 'completed',
        results,
      },
    })
  } catch (error) {
    console.error('Batch detect API error:', error)
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