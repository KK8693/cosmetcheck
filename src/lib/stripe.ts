import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not configured')
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-04-22.dahlia',
      typescript: true,
    })
  }
  return stripeInstance
}

// Price IDs (to be configured in Stripe Dashboard)
export const PRICES = {
  PRO_MONTHLY: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || 'price_pro_monthly',
  PRO_YEARLY: process.env.STRIPE_PRO_YEARLY_PRICE_ID || 'price_pro_yearly',
  TEAM_MONTHLY: process.env.STRIPE_TEAM_MONTHLY_PRICE_ID || 'price_team_monthly',
} as const

export type SubscriptionTier = 'free' | 'pro' | 'team'

export function getTierFromPrice(priceId: string): SubscriptionTier | null {
  if (priceId === PRICES.PRO_MONTHLY || priceId === PRICES.PRO_YEARLY) {
    return 'pro'
  }
  if (priceId === PRICES.TEAM_MONTHLY) {
    return 'team'
  }
  return null
}
