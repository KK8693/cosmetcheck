import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { getOnboardingEmail } from '@/lib/email-templates'
import { getSupabase } from '@/lib/supabase'

export const runtime = 'edge'

/**
 * POST /api/email/onboarding
 * Body: { email: string, locale: 'pt-BR' | 'es-MX' | 'en', step: 1 | 2 | 3, userName?: string }
 *
 * Sends an onboarding welcome email. Prevents duplicate sends within 24h.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, locale = 'en', step, userName } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }
    if (!step || ![1, 2, 3].includes(step)) {
      return NextResponse.json({ error: 'Step must be 1, 2, or 3' }, { status: 400 })
    }

    const supabase = getSupabase()
    if (supabase) {
      // Check for duplicate send within last 24 hours
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      const { data: existing } = await supabase
        .from('email_logs')
        .select('id')
        .eq('to_email', email.toLowerCase().trim())
        .eq('template', `onboarding_${step}`)
        .gte('sent_at', since)
        .limit(1)

      if (existing && existing.length > 0) {
        return NextResponse.json(
          { success: true, skipped: true, reason: 'Already sent within 24h' },
          { status: 200 }
        )
      }
    }

    const template = getOnboardingEmail({ email, locale, step, userName })
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
          template: `onboarding_${step}`,
          subject: template.subject,
          sent_at: new Date().toISOString(),
          provider_id: result.id,
        })
    }

    return NextResponse.json({ success: true, id: result.id })
  } catch (err) {
    console.error('[Onboarding Email] Error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
