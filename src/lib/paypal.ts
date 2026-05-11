const PAYPAL_API_BASE = process.env.PAYPAL_ENVIRONMENT === 'sandbox'
  ? 'https://api-m.sandbox.paypal.com'
  : 'https://api-m.paypal.com'

// Cached access token
let cachedToken: { access_token: string; expires_at: number } | null = null

/**
 * Get PayPal OAuth access token
 * Token expires in ~8 hours (32400 seconds)
 */
export async function getPayPalAccessToken(): Promise<string> {
  const now = Date.now()
  
  // Return cached token if still valid
  if (cachedToken && cachedToken.expires_at > now) {
    return cachedToken.access_token
  }

  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured')
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body: 'grant_type=client_credentials',
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to get PayPal access token: ${error}`)
  }

  const data = await response.json() as { access_token: string; expires_in: number }
  
  // Cache token with 5 minute buffer
  cachedToken = {
    access_token: data.access_token,
    expires_at: now + (data.expires_in - 300) * 1000,
  }

  return data.access_token
}

/**
 * Plan IDs — Multi-currency support
 * Create these in PayPal Dashboard → Subscriptions → Plans
 * Fallback chain: locale-specific → USD monthly → hardcoded sandbox ID
 */
export const PAYPAL_PLANS = {
  // USD (en, zh)
  PRO_MONTHLY_USD: process.env.PAYPAL_PRO_MONTHLY_USD_PLAN_ID || process.env.PAYPAL_PRO_MONTHLY_PLAN_ID || 'P-1BS751417C578393RNH6VPGA',
  PRO_YEARLY_USD: process.env.PAYPAL_PRO_YEARLY_USD_PLAN_ID || '',

  // BRL (pt-BR)
  PRO_MONTHLY_BRL: process.env.PAYPAL_PRO_MONTHLY_BRL_PLAN_ID || '',
  PRO_YEARLY_BRL: process.env.PAYPAL_PRO_YEARLY_BRL_PLAN_ID || '',

  // MXN (es-MX)
  PRO_MONTHLY_MXN: process.env.PAYPAL_PRO_MONTHLY_MXN_PLAN_ID || '',
  PRO_YEARLY_MXN: process.env.PAYPAL_PRO_YEARLY_MXN_PLAN_ID || '',
} as const

// All valid plan IDs for API validation (non-empty values only)
export const VALID_PLAN_IDS = Object.values(PAYPAL_PLANS).filter(Boolean)

/**
 * Get PayPal Plan ID by locale and billing cycle.
 * Fallback: locale-specific → USD → existing PRO_MONTHLY → sandbox hardcoded
 */
export function getPlanId(locale: string, yearly: boolean = false): string {
  const cycle = yearly ? 'YEARLY' : 'MONTHLY'

  // Map locale to currency/region code
  const regionMap: Record<string, string> = {
    'pt-BR': 'BRL',
    'es-MX': 'MXN',
    'en': 'USD',
    'zh': 'USD',
  }

  const region = regionMap[locale] || 'USD'
  const key = `PRO_${cycle}_${region}` as keyof typeof PAYPAL_PLANS
  const planId = PAYPAL_PLANS[key]

  if (planId) return planId

  // Fallback 1: same region monthly (if yearly missing)
  if (yearly) {
    const monthlyKey = `PRO_MONTHLY_${region}` as keyof typeof PAYPAL_PLANS
    const monthlyPlan = PAYPAL_PLANS[monthlyKey]
    if (monthlyPlan) return monthlyPlan
  }

  // Fallback 2: USD monthly (universal default)
  if (PAYPAL_PLANS.PRO_MONTHLY_USD) return PAYPAL_PLANS.PRO_MONTHLY_USD

  // Fallback 3: hardcoded sandbox (dev only)
  return 'P-1BS751417C578393RNH6VPGA'
}

export type SubscriptionTier = 'free' | 'pro' | 'team'

/**
 * Create a PayPal subscription for a plan
 */
// Hardcoded for production stability - Cloudflare env vars may have whitespace issues
const APP_URL = 'https://cosmetcheck.pages.dev'

export async function createSubscription(planId: string, customerId?: string) {
  const accessToken = await getPayPalAccessToken()
  
  const response = await fetch(`${PAYPAL_API_BASE}/v1/billing/subscriptions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      plan_id: planId,
      quantity: '1',
      application_context: {
        brand_name: 'CosmetCheck',
        locale: 'en-US',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'SUBSCRIBE_NOW',
        // PayPal 会自动把 token 作为查询参数附加到此 URL
        return_url: `${APP_URL}/success`,
        cancel_url: `${APP_URL}/pricing?canceled=true`,
      },
      custom_id: customerId,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to create PayPal subscription: ${error}`)
  }

  const data = await response.json() as {
    id: string
    status: string
    links: Array<{ rel: string; href: string }>
  }

  // Find the approval URL
  const approvalUrl = data.links?.find((l) => l.rel === 'approve')?.href

  return {
    subscriptionId: data.id,
    status: data.status,
    approvalUrl,
  }
}

/**
 * Get subscription details
 */
export async function getSubscription(subscriptionId: string) {
  const accessToken = await getPayPalAccessToken()

  const response = await fetch(
    `${PAYPAL_API_BASE}/v1/billing/subscriptions/${subscriptionId}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to get PayPal subscription: ${error}`)
  }

  return response.json()
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(subscriptionId: string, reason?: string) {
  const accessToken = await getPayPalAccessToken()

  const response = await fetch(
    `${PAYPAL_API_BASE}/v1/billing/subscriptions/${subscriptionId}/cancel`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        reason: reason || 'User requested cancellation',
      }),
    }
  )

  if (!response.ok && response.status !== 204) {
    const error = await response.text()
    throw new Error(`Failed to cancel PayPal subscription: ${error}`)
  }

  return true
}

/**
 * Verify PayPal webhook event signature
 */
export async function verifyWebhookSignature(
  body: string,
  headers: Headers
): Promise<boolean> {
  const accessToken = await getPayPalAccessToken()
  const transmissionId = headers.get('paypal-transmission-id')
  const transmissionSignature = headers.get('paypal-transmission-sig')
  const timestamp = headers.get('paypal-transmission-time')
  const webhookId = process.env.PAYPAL_WEBHOOK_ID

  if (!transmissionId || !transmissionSignature || !timestamp || !webhookId) {
    console.warn('Missing webhook verification headers')
    return false // Fail open for now during testing
  }

  try {
    const response = await fetch(
      `${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth_algo: 'SHA256withRSA',
          cert_url: headers.get('paypal-cert-url'),
          transmission_id: transmissionId,
          transmission_sig: transmissionSignature,
          transmission_time: timestamp,
          webhook_id: webhookId,
          webhook_event: JSON.parse(body),
        }),
      }
    )

    if (!response.ok) {
      console.error('Webhook verification failed:', await response.text())
      return false
    }

    const data = await response.json() as { verification_status: string }
    return data.verification_status === 'SUCCESS'
  } catch (error) {
    console.error('Webhook verification error:', error)
    return false
  }
}

/**
 * Map PayPal subscription status to our internal tier
 */
export function getTierFromSubscriptionStatus(
  status: string
): SubscriptionTier | null {
  switch (status) {
    case 'ACTIVE':
    case 'ACTIVATED':
    case 'REACTIVATE':
      return 'pro'
    case 'SUSPENDED':
    case 'CANCELLED':
    case 'EXPIRED':
    case 'PENDING':
    default:
      return 'free'
  }
}