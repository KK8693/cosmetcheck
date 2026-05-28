import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { getAbandonedCheckoutEmail } from '@/lib/email-templates'
import { getSupabase } from '@/lib/supabase'

export const runtime = 'edge'

/**
 * POST /api/email/abandoned-checkout
 * Body: { email: string, locale: 'pt-BR' | 'es-MX' | 'en', plan: 'monthly' | 'yearly', step: 1 | 2 | 3 }
 *
 * Sends abandoned checkout recovery email.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, locale = 'en', plan = 'monthly', step } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }
    if (!step || ![1, 2, 3].includes(step)) {
      return NextResponse.json({ error: 'Step must be 1, 2, or 3' }, { status: 400 })
    }

    const supabase = getSupabase()
    if (supabase) {
      // Prevent duplicate sends within 24h for same step
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      const { data: existing } = await supabase
        .from('email_logs')
        .select('id')
        .eq('to_email', email.toLowerCase().trim())
        .eq('template', `abandoned_${step}`)
        .gte('sent_at', since)
        .limit(1)

      if (existing && existing.length > 0) {
        return NextResponse.json(
          { success: true, skipped: true, reason: 'Already sent within 24h' },
          { status: 200 }
        )
      }
    }

    const template = getAbandonedCheckoutEmail({ email, locale, plan, step })
    const result = await sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      )
    }

    // Log send
    if (supabase) {
      await supabase.from('email_logs')
        // @ts-expect-error - Supabase type generation issue
        .insert({
          to_email: email.toLowerCase().trim(),
          template: `abandoned_${step}`,
          subject: template.subject,
          sent_at: new Date().toISOString(),
          provider_id: result.id,
        })
    }

    return NextResponse.json({ success: true, id: result.id })
  } catch (err) {
    console.error('[Abandoned Checkout Email] Error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/email/abandoned-checkout
 * Body: { email: string, plan: 'monthly' | 'yearly', locale?: string }
 *
 * Records an abandoned checkout event for later recovery.
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, plan = 'monthly', locale = 'en' } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      )
    }

    // Upsert abandoned checkout record
    const { error } = await supabase.from('abandoned_checkouts')
      // @ts-expect-error - Supabase type generation issue
      .upsert({
        email: email.toLowerCase().trim(),
        plan,
        locale,
        abandoned_at: new Date().toISOString(),
        recovered: false,
        step_sent: 0,
      }, { onConflict: 'email' })

    if (error) {
      console.error('[Abandoned Checkout] DB error:', error)
      return NextResponse.json(
        { error: 'Failed to record abandoned checkout' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, recorded: true })
  } catch (err) {
    console.error('[Abandoned Checkout] Error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
