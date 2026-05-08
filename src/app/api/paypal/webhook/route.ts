import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature, getTierFromSubscriptionStatus } from '@/lib/paypal'

export const runtime = 'edge'

// PayPal webhook event types we care about
const SUBSCRIPTION_EVENTS = {
  'BILLING.SUBSCRIPTION.CREATED': 'subscription_created',
  'BILLING.SUBSCRIPTION.ACTIVATED': 'subscription_activated',
  'BILLING.SUBSCRIPTION.REACTIVATED': 'subscription_reactivated',
  'BILLING.SUBSCRIPTION.SUSPENDED': 'subscription_suspended',
  'BILLING.SUBSCRIPTION.CANCELLED': 'subscription_cancelled',
  'BILLING.SUBSCRIPTION.EXPIRED': 'subscription_expired',
  'BILLING.SUBSCRIPTION.PAYMENT.FAILED': 'payment_failed',
} as const

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headers = request.headers

    // For sandbox testing, we may skip verification
    const isSandbox = process.env.PAYPAL_ENVIRONMENT === 'sandbox'
    
    // Verify webhook signature (skip in sandbox if no webhook ID configured)
    if (!isSandbox || process.env.PAYPAL_WEBHOOK_ID) {
      const isValid = await verifyWebhookSignature(body, headers)
      if (!isValid) {
        console.error('Invalid webhook signature')
        return NextResponse.json(
          { error: 'Invalid webhook signature' },
          { status: 401 }
        )
      }
    }

    const event = JSON.parse(body) as {
      event_type: string
      id: string
      resource: {
        id?: string
        status?: string
        plan_id?: string
        custom_id?: string
        billing_info?: {
          next_billing_time?: string
          last_payment?: {
            amount?: { value?: string; currency_code?: string }
          }
        }
      }
    }

    console.log('PayPal webhook received:', event.event_type, event.id)

    const eventType = event.event_type as keyof typeof SUBSCRIPTION_EVENTS
    const subscriptionId = event.resource?.id
    const customId = event.resource?.custom_id // Customer ID from our app

    // Handle subscription status changes
    if (subscriptionId && eventType in SUBSCRIPTION_EVENTS) {
      const newStatus = event.resource?.status
      const tier = getTierFromSubscriptionStatus(newStatus || '')

      console.log(`Subscription ${subscriptionId} status: ${newStatus} -> tier: ${tier}`)

      // TODO: Update user subscription in Supabase
      // await updateUserSubscription(customId, subscriptionId, tier)
      
      // For now, just log - we'll integrate with Supabase auth later
      switch (eventType) {
        case 'BILLING.SUBSCRIPTION.ACTIVATED':
        case 'BILLING.SUBSCRIPTION.REACTIVATED':
          console.log('✅ Subscription ACTIVE:', subscriptionId)
          // TODO: Update database to pro tier
          break
        case 'BILLING.SUBSCRIPTION.SUSPENDED':
          console.log('⚠️ Subscription SUSPENDED:', subscriptionId)
          // TODO: Handle payment failure - warn user
          break
        case 'BILLING.SUBSCRIPTION.CANCELLED':
        case 'BILLING.SUBSCRIPTION.EXPIRED':
          console.log('❌ Subscription CANCELLED/EXPIRED:', subscriptionId)
          // TODO: Downgrade to free tier
          break
        case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED':
          console.log('💳 Payment FAILED for subscription:', subscriptionId)
          // TODO: Send email notification, offer retry
          break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// GET endpoint for webhook verification (PayPal ping)
export async function GET() {
  return NextResponse.json({ status: 'ok', service: 'PayPal Webhook' })
}