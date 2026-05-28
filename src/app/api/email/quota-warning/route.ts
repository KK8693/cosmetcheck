import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { getQuotaWarningEmail } from '@/lib/email-templates'
import { getSupabase } from '@/lib/supabase'

export const runtime = 'edge'

/**
 * POST /api/email/quota-warning
 * Body: { email: string, locale: 'pt-BR' | 'es-MX' | 'en', used: number, limit: number, percent: 80 | 100 }
 *
 * Sends quota warning email. Prevents duplicate sends for same threshold.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, locale = 'en', used, limit, percent } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }
    if (typeof used !== 'number' || typeof limit !== 'number') {
      return NextResponse.json({ error: 'Used and limit are required' }, { status: 400 })
    }
    if (percent !== 80 && percent !== 100) {
      return NextResponse.json({ error: 'Percent must be 80 or 100' }, { status: 400 })
    }

    const supabase = getSupabase()
    if (supabase) {
      // Check for duplicate send for same threshold within current month
      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      const { data: existing } = await supabase
        .from('email_logs')
        .select('id')
        .eq('to_email', email.toLowerCase().trim())
        .eq('template', `quota_${percent}`)
        .gte('sent_at', monthStart)
        .limit(1)

      if (existing && existing.length > 0) {
        return NextResponse.json(
          { success: true, skipped: true, reason: 'Already sent this month' },
          { status: 200 }
        )
      }
    }

    const template = getQuotaWarningEmail({ email, locale, used, limit, percent })
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
          template: `quota_${percent}`,
          subject: template.subject,
          sent_at: new Date().toISOString(),
          provider_id: result.id,
        })
    }

    return NextResponse.json({ success: true, id: result.id })
  } catch (err) {
    console.error('[Quota Warning Email] Error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
