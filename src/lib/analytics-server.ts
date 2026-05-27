// src/lib/analytics-server.ts
// GA4 Measurement Protocol sender for Edge Runtime

import { NextRequest } from 'next/server'

type AnalyticsEventName =
  | 'analysis_complete'
  | 'subscription_completed'
  | 'subscription_cancelled'

type EventParams =
  | { regulation: 'anvisa' | 'cofepris'; result_status: 'pass' | 'fail' | 'warn' }
  | { plan: 'monthly' | 'yearly'; value: number; currency: string; provider: 'stripe' | 'paypal' }
  | { plan: 'monthly' | 'yearly'; reason?: string }

interface AnalyticsContext {
  clientId: string
  userId?: string
  userProperties?: Record<string, { value: string }>
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID
const GA_API_SECRET = process.env.GA_API_SECRET

function isDebugMode(): boolean {
  return process.env.NODE_ENV === 'development'
}

function debugLog(label: string, data: unknown): void {
  if (isDebugMode()) {
    // eslint-disable-next-line no-console
    console.log(`[Analytics Server] ${label}`, data)
  }
}

/**
 * Extract GA4 client_id from the _ga cookie.
 * Cookie format: GA1.1.<client_id>.<timestamp>
 * Returns the raw cookie value or a fallback.
 */
export function extractClientId(request: NextRequest): string {
  try {
    const gaCookie = request.cookies.get('_ga')
    if (gaCookie?.value) {
      // GA cookie format: GA1.1.1234567890.9876543210
      const parts = gaCookie.value.split('.')
      if (parts.length >= 4) {
        return `${parts[2]}.${parts[3]}`
      }
      return gaCookie.value
    }
  } catch {
    // ignore
  }

  // Fallback: try to get from x-client-id header (set by frontend)
  const headerClientId = request.headers.get('x-client-id')
  if (headerClientId) return headerClientId

  return 'anonymous_server'
}

/**
 * Send an event to GA4 via Measurement Protocol v2.
 * Non-blocking: errors are logged but not thrown.
 */
export async function sendServerEvent(
  eventName: AnalyticsEventName,
  params: EventParams,
  context: AnalyticsContext
): Promise<void> {
  if (!GA_ID || !GA_API_SECRET) {
    debugLog('skip', { reason: 'Missing GA_ID or GA_API_SECRET' })
    return
  }

  const payload: Record<string, unknown> = {
    client_id: context.clientId,
    events: [
      {
        name: eventName,
        params: {
          ...params,
          debug_mode: isDebugMode(),
        },
      },
    ],
  }

  if (context.userId) {
    payload.user_id = context.userId
  }

  if (context.userProperties) {
    payload.user_properties = context.userProperties
  }

  debugLog('send', { eventName, payload })

  try {
    const response = await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${GA_ID}&api_secret=${GA_API_SECRET}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    )

    if (!response.ok) {
      const text = await response.text().catch(() => 'unknown error')
      debugLog('error', { status: response.status, text })
    } else {
      debugLog('ok', { eventName })
    }
  } catch (err) {
    debugLog('fetch error', err)
  }
}

/**
 * Convenience wrapper for compliance check completion.
 */
export async function trackAnalysisComplete(
  request: NextRequest,
  country: 'BR' | 'MX',
  resultStatus: 'pass' | 'fail' | 'warn',
  userId?: string
): Promise<void> {
  await sendServerEvent(
    'analysis_complete',
    {
      regulation: country === 'BR' ? 'anvisa' : 'cofepris',
      result_status: resultStatus,
    },
    {
      clientId: extractClientId(request),
      userId,
    }
  )
}

/**
 * Convenience wrapper for subscription completed.
 */
export async function trackSubscriptionCompleted(
  request: NextRequest,
  plan: 'monthly' | 'yearly',
  value: number,
  currency: string,
  provider: 'stripe' | 'paypal',
  userId?: string
): Promise<void> {
  await sendServerEvent(
    'subscription_completed',
    { plan, value, currency, provider },
    {
      clientId: extractClientId(request),
      userId,
      userProperties: { user_type: { value: 'paid' } },
    }
  )
}

/**
 * Convenience wrapper for subscription cancelled.
 */
export async function trackSubscriptionCancelled(
  request: NextRequest,
  plan: 'monthly' | 'yearly',
  userId?: string,
  reason?: string
): Promise<void> {
  await sendServerEvent(
    'subscription_cancelled',
    { plan, reason },
    {
      clientId: extractClientId(request),
      userId,
    }
  )
}
