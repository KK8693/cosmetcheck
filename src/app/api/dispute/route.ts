import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

// Create Supabase admin client for server-side operations
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(supabaseUrl, supabaseKey)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { country, ruleId, originalInput, userReason, expectedResult, userEmail } = body

    // Validation
    if (!country || !['BR', 'MX'].includes(country)) {
      return NextResponse.json(
        { error: 'Invalid country. Must be BR or MX' },
        { status: 400 }
      )
    }

    if (!ruleId || typeof ruleId !== 'string') {
      return NextResponse.json(
        { error: 'ruleId is required' },
        { status: 400 }
      )
    }

    if (!originalInput || typeof originalInput !== 'string') {
      return NextResponse.json(
        { error: 'originalInput is required' },
        { status: 400 }
      )
    }

    if (!userReason || typeof userReason !== 'string') {
      return NextResponse.json(
        { error: 'userReason is required' },
        { status: 400 }
      )
    }

    if (userReason.length < 10) {
      return NextResponse.json(
        { error: 'Please provide more detailed reason (at least 10 characters)' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseAdmin()

    // Insert dispute report
    const { data, error } = await supabase
      .from('dispute_reports')
      .insert({
        user_email: userEmail || null,
        country,
        rule_id: ruleId,
        original_input: originalInput,
        user_reason: userReason,
        expected_result: expectedResult || null,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      console.error('[Dispute API] Database error:', error)
      return NextResponse.json(
        { error: 'Failed to submit dispute report' },
        { status: 500 }
      )
    }

    console.log(`[Dispute API] New dispute report: ${data.id} for rule ${ruleId}`)

    return NextResponse.json({
      success: true,
      message: 'Dispute report submitted successfully. Our team will review it within 48 hours.',
      reportId: data.id,
    })
  } catch (error) {
    console.error('[Dispute API] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
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