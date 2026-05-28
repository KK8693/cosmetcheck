// src/lib/email.ts
// Resend email service wrapper for Edge Runtime

export type EmailLocale = 'pt-BR' | 'es-MX' | 'en'

export interface SendEmailOptions {
  to: string
  subject: string
  html: string
  from?: string
}

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev'

/**
 * Send email via Resend REST API (Edge Runtime compatible)
 */
export async function sendEmail(options: SendEmailOptions): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!RESEND_API_KEY) {
    console.warn('[Email] RESEND_API_KEY not configured')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: options.from || FROM_EMAIL,
        to: options.to,
        subject: options.subject,
        html: options.html,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
      console.error('[Email] Resend API error:', errorData)
      return { success: false, error: errorData.message || `HTTP ${response.status}` }
    }

    const data = await response.json()
    console.log(`[Email] Sent to ${options.to}, id: ${data.id}`)
    return { success: true, id: data.id }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[Email] Send failed:', message)
    return { success: false, error: message }
  }
}

/**
 * Detect user locale from various signals
 */
export function detectLocale(preferred?: string): EmailLocale {
  if (preferred === 'pt-BR' || preferred === 'pt') return 'pt-BR'
  if (preferred === 'es-MX' || preferred === 'es') return 'es-MX'
  return 'en'
}
