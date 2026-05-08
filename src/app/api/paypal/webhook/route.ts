import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature, parseWebhookEvent } from '@/lib/paypal'

export const runtime = 'edge'

/**
 * PayPal Webhook Handler
 * 
 * Handles subscription events:
 * - BILLING.SUBSCRIPTION.CREATED
 * - BILLING.SUBSCRIPTION.ACTIVATED
 * - BILLING.SUBSCRIPTION.CANCELLED
 * - BILLING.SUBSCRIPTION.PAYMENT.FAILED
 * - BILLING.SUBSCRIPTION.EXPIRED
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headers: Record<string, string> = {}

    request.headers.forEach((value, key) => {
      headers[key] = value
    })

    // Verify webhook signature (skip in development)
    if (process.env.NODE_ENV === 'production' && process.env.PAYPAL_WEBHOOK_ID) {
      const isValid = await verifyWebhookSignature(body, headers)
      if (!isValid) {
        console.error('Invalid webhook signature')
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 400 }
        )
      }
    }

    const event = JSON.parse(body)
    console.log('PayPal webhook received:', event.event_type)

    const parsed = parseWebhookEvent(event)
    
    // TODO: Update user subscription in database based on event
    // Example:
    // - activated: Update user to pro tier, set subscription_end_date
    // - payment_failed: Send notification, grace period
    // - cancelled/expired: Downgrade to free tier
    
    switch (parsed.action) {
      case 'activated': {
        console.log('Subscription activated:', parsed.subscriptionId)
        // TODO: Update database - set user to pro, store subscription_id
        // await db.user.update({
        //   where: { subscriptionId: parsed.subscriptionId },
        //   data: { tier: 'pro', subscriptionEnd: ... }
        // })
        break
      }
      case 'cancelled':
      case 'expired': {
        console.log('Subscription ended:', parsed.subscriptionId)
        // TODO: Downgrade user to free tier
        // await db.user.update({
        //   where: { subscriptionId: parsed.subscriptionId },
        //   data: { tier: 'free' }
        // })
        break
      }
      case 'payment_failed': {
        console.log('Payment failed for subscription:', parsed.subscriptionId)
        // TODO: Notify user, start grace period
        break
      }
      default:
        console.log('Unhandled webhook event:', parsed.eventType)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}