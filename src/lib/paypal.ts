import { NextRequest, NextResponse } from 'next/server'

// PayPal API configuration
const PAYPAL_API_BASE = process.env.PAYPAL_ENVIRONMENT === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com'

const CLIENT_ID = process.env.PAYPAL_CLIENT_ID!
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!

// In-memory token cache (production should use Redis/database)
let cachedToken: { access_token: string; expires_at: number } | null = null

/**
 * Get PayPal access token with caching
 */
export async function getAccessToken(): Promise<string> {
  const now = Date.now()

  // Return cached token if still valid
  if (cachedToken && cachedToken.expires_at > now) {
    return cachedToken.access_token
  }

  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`PayPal token error: ${error}`)
  }

  const data = await response.json()
  
  // Cache token with 5-minute buffer
  cachedToken = {
    access_token: data.access_token,
    expires_at: now + (data.expires_in - 300) * 1000,
  }

  return data.access_token
}

/**
 * Plan IDs for different subscription tiers
 * These are created in PayPal Developer Dashboard
 */
export const PLANS = {
  PRO_MONTHLY: process.env.PAYPAL_PRO_MONTHLY_PLAN_ID || 'P-1BS751417C578393RNH6VPGA',
} as const

export type SubscriptionTier = 'free' | 'pro'

/**
 * Create a subscription approval URL
 */
export async function createSubscriptionLink(planId: string): Promise<string> {
  const token = await getAccessToken()

  const response = await fetch(`${PAYPAL_API_BASE}/v1/billing/plans/${planId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to get plan: ${await response.text()}`)
  }

  const plan = await response.json()
  
  // Generate subscription approval link
  // User will be redirected to PayPal to approve the subscription
  const approveUrl = `${PAYPAL_API_BASE}/v1/billing/subscriptions?plan_id=${planId}`
  
  return approveUrl
}

/**
 * Verify PayPal webhook signature
 */
export async function verifyWebhookSignature(
  body: string,
  headers: Record<string, string>
): Promise<boolean> {
  const transmissionId = headers['paypal-transmission-id']
  const signature = headers['paypal-transmission-sig']
  const timestamp = headers['paypal-transmission-time']
  const certUrl = headers['paypal-cert-url']

  if (!transmissionId || !signature || !timestamp || !certUrl) {
    return false
  }

  const token = await getAccessToken()

  const response = await fetch(`${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      auth_algo: 'SHA256withRSA',
      cert_url: certUrl,
      transmission_id: transmissionId,
      transmission_sig: signature,
      transmission_time: timestamp,
      webhook_id: process.env.PAYPAL_WEBHOOK_ID,
      webhook_event: JSON.parse(body),
    }),
  })

  if (!response.ok) {
    console.error('Webhook verification failed:', await response.text())
    return false
  }

  const result = await response.json()
  return result.verification_status === 'SUCCESS'
}

/**
 * Handle subscription-related webhook events
 */
export function parseWebhookEvent(event: Record<string, unknown>) {
  const eventType = event.event_type as string
  
  switch (eventType) {
    case 'BILLING.SUBSCRIPTION.CREATED':
      return { action: 'created', subscriptionId: event.id }
    case 'BILLING.SUBSCRIPTION.ACTIVATED':
      return { action: 'activated', subscriptionId: event.id }
    case 'BILLING.SUBSCRIPTION.CANCELLED':
      return { action: 'cancelled', subscriptionId: event.id }
    case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED':
      return { action: 'payment_failed', subscriptionId: event.id }
    case 'BILLING.SUBSCRIPTION.EXPIRED':
      return { action: 'expired', subscriptionId: event.id }
    default:
      return { action: 'unknown', eventType }
  }
}