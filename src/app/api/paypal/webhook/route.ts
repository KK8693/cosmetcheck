import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature, getTierFromSubscriptionStatus } from '@/lib/paypal'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { trackSubscriptionCompleted } from '@/lib/analytics-server'

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

async function updateUserSubscription(
  subscriptionId: string,
  status: string,
  planId?: string,
  customId?: string
) {
  try {
    const supabase = getSupabaseAdmin()
    const tier = getTierFromSubscriptionStatus(status)
    const isActive = tier === 'pro'

    // Map PayPal plan ID to subscription plan
    let subscriptionPlan: string | null = null
    if (planId) {
      if (planId.includes('YEAR') || planId.includes('ANNUAL')) {
        subscriptionPlan = 'pro-annual'
      } else {
        subscriptionPlan = 'pro-monthly'
      }
    }

    const updateData: Record<string, string | boolean | null> = {
      paypal_subscription_id: subscriptionId,
      subscription_provider: 'paypal',
      subscription_status: isActive ? 'active' : (status?.toLowerCase() || 'canceled'),
      subscription_tier: isActive ? 'pro' : 'free',
      updated_at: new Date().toISOString(),
    }

    if (subscriptionPlan) {
      updateData.subscription_plan = subscriptionPlan
    }

    // Try to find user by custom_id (user ID from our app) first
    if (customId) {
      const { error } = await supabase
        .from('users')
        .update(updateData as never)
        .eq('id', customId)

      if (!error) {
        console.log(`✅ Updated user ${customId} subscription via custom_id`)
        return
      }
    }

    // Fallback: find user by paypal_subscription_id
    const { error } = await supabase
      .from('users')
      .update(updateData as never)
      .eq('paypal_subscription_id', subscriptionId)

    if (error) {
      console.error('Failed to update user subscription:', error)
    } else {
      console.log(`✅ Updated subscription ${subscriptionId}`)
    }
  } catch (error) {
    console.error('Error updating subscription:', error)
  }
}

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

      await updateUserSubscription(
        subscriptionId,
        newStatus || '',
        event.resource?.plan_id,
        customId
      )

      switch (eventType) {
        case 'BILLING.SUBSCRIPTION.CREATED':
          console.log('✅ Subscription CREATED:', subscriptionId)
          break
        case 'BILLING.SUBSCRIPTION.ACTIVATED':
        case 'BILLING.SUBSCRIPTION.REACTIVATED':
          console.log('✅ Subscription ACTIVE:', subscriptionId)
          // Track subscription completed
          {
            const plan = event.resource?.plan_id?.includes('YEAR') || event.resource?.plan_id?.includes('ANNUAL')
              ? 'yearly'
              : 'monthly'
            const paymentAmount = event.resource?.billing_info?.last_payment?.amount
            await trackSubscriptionCompleted(
              request,
              plan,
              parseFloat(paymentAmount?.value || '0'),
              paymentAmount?.currency_code?.toUpperCase() || 'USD',
              'paypal',
              customId || subscriptionId
            ).catch(() => { /* silently fail */ })
          }
          break
        case 'BILLING.SUBSCRIPTION.SUSPENDED':
          console.log('⚠️ Subscription SUSPENDED:', subscriptionId)
          break
        case 'BILLING.SUBSCRIPTION.CANCELLED':
        case 'BILLING.SUBSCRIPTION.EXPIRED':
          console.log('❌ Subscription CANCELLED/EXPIRED:', subscriptionId)
          break
        case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED':
          console.log('💳 Payment FAILED for subscription:', subscriptionId)
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