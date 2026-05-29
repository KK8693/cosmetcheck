import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { getOnboardingEmail } from '@/lib/email-templates'
import { getSupabase } from '@/lib/supabase'

export const runtime = 'edge'

/**
 * GET /api/email/cron/onboarding-nurture
 * Query: ?secret=CRON_SECRET
 *
 * Sends onboarding nurture emails #2 (+24h) and #3 (+72h).
 * Should be called every 6 hours.
 */
export async function GET(request: NextRequest) {
  // Auth check
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
    // Fetch all onboarding_1 emails sent in the last 96 hours
    const since = new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString()
    const { data: step1Logs, error: step1Error } = await supabase
      .from('email_logs')
      .select('*')
      .eq('template', 'onboarding_1')
      .gte('sent_at', since)
      .order('sent_at', { ascending: true })

    if (step1Error) {
      console.error('[Cron] Failed to fetch onboarding_1 logs:', step1Error)
      return NextResponse.json({ error: 'Database query failed' }, { status: 500 })
    }

    if (!step1Logs || step1Logs.length === 0) {
      return NextResponse.json({ success: true, message: 'No pending onboarding nurture', results })
    }

    for (const record of step1Logs as any[]) {
      const email = record.to_email as string
      const sentAt = new Date(record.sent_at)
      const hoursElapsed = (now.getTime() - sentAt.getTime()) / (1000 * 60 * 60)

      // Determine target step
      let targetStep: number | null = null
      if (hoursElapsed >= 24 && hoursElapsed < 48) {
        targetStep = 2
      } else if (hoursElapsed >= 72 && hoursElapsed < 96) {
        targetStep = 3
      }

      if (!targetStep) {
        results.skipped++
        continue
      }

      // Check if already sent for this step
      const { data: existing } = await supabase
        .from('email_logs')
        .select('id')
        .eq('to_email', email.toLowerCase())
        .eq('template', `onboarding_${targetStep}`)
        .limit(1)

      if (existing && existing.length > 0) {
        results.skipped++
        continue
      }

      // Get user info from users table for locale and name
      let locale: 'pt-BR' | 'es-MX' | 'en' = 'en'
      let userName: string | undefined

      try {
        const { data: userData } = await supabase
          .from('users')
          .select('preferred_language, full_name')
          .eq('email', email.toLowerCase())
          .maybeSingle()

        if (userData) {
          const lang = userData.preferred_language
          if (lang === 'pt-BR' || lang === 'es-MX' || lang === 'en') {
            locale = lang
          }
          userName = userData.full_name || undefined
        }
      } catch {
        // Fallback to defaults if users query fails
      }

      // Send email
      const template = getOnboardingEmail({ email, locale, step: targetStep as 1 | 2 | 3, userName })

      const sendResult = await sendEmail({
        to: email,
        subject: template.subject,
        html: template.html,
      })

      if (sendResult.success) {
        results.sent++
        await supabase.from('email_logs')
          // @ts-expect-error - Supabase type generation issue
          .insert({
            to_email: email.toLowerCase(),
            template: `onboarding_${targetStep}`,
            subject: template.subject,
            sent_at: now.toISOString(),
            provider_id: sendResult.id,
          })
      } else {
        results.errors++
        console.error(`[Cron] Failed to send onboarding_${targetStep} to ${email}:`, sendResult.error)
      }
    }

    return NextResponse.json({
      success: true,
      processed: step1Logs.length,
      results,
    })
  } catch (err) {
    console.error('[Cron] Onboarding nurture processing error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
