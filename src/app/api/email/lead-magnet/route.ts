import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { getLeadMagnetEmail } from '@/lib/email-templates'
import { getSupabase } from '@/lib/supabase'

export const runtime = 'edge'

/**
 * POST /api/email/lead-magnet
 * Body: { email: string, locale: 'pt-BR' | 'es-MX' | 'en', userName?: string, magnetType: string }
 *
 * Sends a lead magnet download email with PDF link.
 * Logs email to email_logs table if Supabase is available.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, locale = 'pt-BR', userName, magnetType = 'checklist-compliance-anvisa-2025' } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const validLocales = ['pt-BR', 'es-MX', 'en'] as const
    if (!validLocales.includes(locale)) {
      return NextResponse.json({ error: 'Invalid locale' }, { status: 400 })
    }

    // PDF URL (hosted on the site)
    const pdfUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://cosmetcheck.com'}/downloads/cosmetcheck-checklist-compliance-anvisa-2025.pdf`

    const template = getLeadMagnetEmail({
      email,
      locale: locale as 'pt-BR' | 'es-MX' | 'en',
      userName,
      pdfUrl,
      magnetType: magnetType as 'checklist-compliance-anvisa-2025',
    })

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

    // Log to Supabase if available
    const supabase = getSupabase()
    if (supabase) {
      await supabase.from('email_logs')
        // @ts-expect-error - Supabase type generation issue
        .insert({
          to_email: email.toLowerCase().trim(),
          template: `lead_magnet_${magnetType}`,
          subject: template.subject,
          sent_at: new Date().toISOString(),
          provider_id: result.id,
        })
    }

    return NextResponse.json({ success: true, id: result.id, pdfUrl })
  } catch (err) {
    console.error('[Lead Magnet Email] Error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
