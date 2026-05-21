import { NextRequest, NextResponse } from 'next/server'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Lazy initialization for Edge Runtime compatibility
let _supabaseAdmin: SupabaseClient | null = null

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

/**
 * Escape CSV field value
 */
function escapeCsv(value: string | number): string {
  const str = String(value ?? '')
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

/**
 * Convert batch results to CSV
 */
function generateCsv(rows: Array<{
  row_index: number
  product_id: string | null
  original_text: string
  country: string
  is_compliant: boolean
  violations: unknown
}>): string {
  // Header
  const headers = [
    'Index',
    'Product ID',
    'Original Text',
    'Country',
    'Compliant',
    'Critical Count',
    'Warning Count',
    'Info Count',
    'Total Issues',
    'Violations',
  ]
  let csv = headers.map(escapeCsv).join(',') + '\n'

  // Rows
  for (const row of rows) {
    let violations: Array<{
      severity?: string
      message?: string
      suggestion?: string
      category?: string
    }> = []

    if (typeof row.violations === 'string') {
      try {
        violations = JSON.parse(row.violations)
      } catch {
        violations = []
      }
    } else if (Array.isArray(row.violations)) {
      violations = row.violations as Array<{
        severity?: string
        message?: string
        suggestion?: string
        category?: string
      }>
    }

    const criticalCount = violations.filter((v) => v.severity === 'critical').length
    const warningCount = violations.filter((v) => v.severity === 'warning').length
    const infoCount = violations.filter((v) => v.severity === 'info').length
    const totalIssues = violations.length

    const violationText = violations
      .map(
        (v) =>
          `[${v.severity?.toUpperCase() || 'INFO'}] ${v.message || ''}${v.suggestion ? ` (Suggestion: ${v.suggestion})` : ''}`
      )
      .join('; ')

    const line = [
      row.row_index + 1,
      row.product_id || `P${row.row_index + 1}`,
      row.original_text,
      row.country,
      row.is_compliant ? 'Yes' : 'No',
      criticalCount,
      warningCount,
      infoCount,
      totalIssues,
      violationText,
    ]
      .map(escapeCsv)
      .join(',')

    csv += line + '\n'
  }

  return csv
}

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

    // Fetch results from Supabase
    const { data: rows, error: queryError } = await getSupabaseAdmin()
      .from('batch_results')
      .select('*')
      .eq('task_id', id)
      .order('row_index', { ascending: true })

    if (queryError) {
      console.error('Export query error:', queryError)
      return NextResponse.json(
        { error: 'Failed to fetch results' },
        { status: 500 }
      )
    }

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: 'No results found for this task' },
        { status: 404 }
      )
    }

    const csv = generateCsv(rows)

    // Return CSV as downloadable file
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="batch-results-${id}.csv"`,
      },
    })
  } catch (error) {
    console.error('Batch export API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Allow OPTIONS for CORS
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  )
}
