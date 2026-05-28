import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { getAbandonedCheckoutEmail } from '@/lib/email-templates'
import { getSupabase } from '@/lib/supabase'

export const runtime = 'edge'

/**
 * GET /api/email/cron/abandoned-checkout
 * Query: ?secret=CRON_SECRET
 *
 * Processes abandoned checkout recovery emails.
 * Should be called by a cron job every hour.
 *
 * Timing rules:
 * - Step 1: +1 hour after abandonment
 * - Step 2: +24 hours after abandonment  
 * - Step 3: +72 hours after abandonment
 */
export async function GET(request: NextRequest) {
  // Simple auth check
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabase()
  if (!supabase) {
    return NextResponse.json({ error: 'Database not available' }, { status: 503 })
  }

  const now = new Date()
  const results = { sent: 0, skipped: 0, errors: 0 }

  try {
    // Fetch unrecovered abandoned checkouts
    const { data: checkouts, error } = await supabase
      .from('abandoned_checkouts')
      .select('*')
      .eq('recovered', false)
      .lt('step_sent', 3)
      .order('abandoned_at', { ascending: true })
      .limit(50)

    if (error) {
      console.error('[Cron] Failed to fetch abandoned checkouts:', error)
      return NextResponse.json({ error: 'Database query failed' }, { status: 500 })
    }

    if (!checkouts || checkouts.length === 0) {
      return NextResponse.json({ success: true, message: 'No pending abandoned checkouts', results })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const record of checkouts as any[]) {
      const abandonedAt = new Date(record.abandoned_at)
      const hoursElapsed = (now.getTime() - abandonedAt.getTime()) / (1000 * 60 * 60)
      const currentStep = record.step_sent as number
      let targetStep: number | null = null

      // Determine which step to send
      if (currentStep < 1 && hoursElapsed >= 1) {
        targetStep = 1
      } else if (currentStep < 2 && hoursElapsed >= 24) {
        targetStep = 2
      } else if (currentStep < 3 && hoursElapsed >= 72) {
        targetStep = 3
      }

      if (!targetStep) {
        results.skipped++
        continue
      }

      // Check for duplicate send within 24h (defensive)
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      const { data: existing } = await supabase
        .from('email_logs')
        .select('id')
        .eq('to_email', record.email.toLowerCase())
        .eq('template', `abandoned_${targetStep}`)
        .gte('sent_at', since)
        .limit(1)

      if (existing && existing.length > 0) {
        results.skipped++
        // Update step_sent to avoid re-processing
        await supabase.from('abandoned_checkouts')
          // @ts-expect-error - Supabase type generation issue
          .update({ step_sent: targetStep, updated_at: now.toISOString() })
          .eq('id', record.id)
        continue
      }

      // Send email
      const template = getAbandonedCheckoutEmail({
        email: record.email,
        locale: record.locale || 'en',
        plan: record.plan || 'monthly',
        step: targetStep as 1 | 2 | 3,
      })

      const sendResult = await sendEmail({
        to: record.email,
        subject: template.subject,
        html: template.html,
      })

      if (sendResult.success) {
        results.sent++
        // Update record
        await supabase.from('abandoned_checkouts')
          // @ts-expect-error - Supabase type generation issue
          .update({ step_sent: targetStep, updated_at: now.toISOString() })
          .eq('id', record.id)

        // Log email
        await supabase.from('email_logs')
          // @ts-expect-error - Supabase type generation issue
          .insert({
            to_email: record.email.toLowerCase(),
            template: `abandoned_${targetStep}`,
            subject: template.subject,
            sent_at: now.toISOString(),
            provider_id: sendResult.id,
          })
      } else {
        results.errors++
        console.error(`[Cron] Failed to send abandoned checkout email to ${record.email}:`, sendResult.error)
      }
    }

    return NextResponse.json({
      success: true,
      processed: checkouts.length,
      results,
    })
  } catch (err) {
    console.error('[Cron] Abandoned checkout processing error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
