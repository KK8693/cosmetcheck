import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const runtime = 'edge'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      )
    }

    // Get task
    const { data: task, error: taskError } = await supabase
      .from('batch_tasks')
      .select('*')
      .eq('id', id)
      .single()

    if (taskError || !task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    // Get results count
    const { count } = await supabase
      .from('batch_results')
      .select('*', { count: 'exact', head: true })
      .eq('task_id', id)

    // Get recent results
    const { data: results } = await supabase
      .from('batch_results')
      .select('*')
      .eq('task_id', id)
      .order('row_index', { ascending: true })
      .limit(10)

    return NextResponse.json({
      success: true,
      data: {
        task: {
          id: task.id,
          taskType: task.task_type,
          totalCount: task.total_count,
          completedCount: task.completed_count,
          passedCount: task.passed_count,
          failedCount: task.failed_count,
          criticalCount: task.critical_count,
          warningCount: task.warning_count,
          infoCount: task.info_count,
          status: task.status,
          errorMessage: task.error_message,
          createdAt: task.created_at,
          completedAt: task.completed_at,
        },
        totalResults: count || 0,
        results: results?.map(r => ({
          index: r.row_index,
          productId: r.product_id,
          originalText: r.original_text,
          country: r.country,
          isCompliant: r.is_compliant,
          violations: typeof r.violations === 'string' 
            ? JSON.parse(r.violations) 
            : r.violations,
        })) || [],
      },
    })
  } catch (error) {
    console.error('Batch task API error:', error)
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}