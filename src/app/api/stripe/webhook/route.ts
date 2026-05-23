import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { headers } from 'next/headers'

export const runtime = 'edge'

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

async function updateUserFromStripe(
  customerId: string,
  subscriptionId: string,
  status: string,
  priceId?: string,
  currentPeriodStart?: number,
  currentPeriodEnd?: number,
  cancelAtPeriodEnd?: boolean
) {
  try {
    const supabase = getSupabaseAdmin()

    const updateData: Record<string, unknown> = {
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      subscription_provider: 'stripe',
      subscription_status: status === 'active' ? 'active' : status,
      subscription_tier: status === 'active' ? 'pro' : 'free',
      updated_at: new Date().toISOString(),
    }

    if (priceId) {
      if (priceId.includes('year') || priceId.includes('annual')) {
        updateData.subscription_plan = 'pro-annual'
      } else {
        updateData.subscription_plan = 'pro-monthly'
      }
    }

    if (currentPeriodStart) {
      updateData.current_period_start = new Date(currentPeriodStart * 1000).toISOString()
    }
    if (currentPeriodEnd) {
      updateData.current_period_end = new Date(currentPeriodEnd * 1000).toISOString()
    }
    if (typeof cancelAtPeriodEnd === 'boolean') {
      updateData.cancel_at_period_end = cancelAtPeriodEnd
    }

    // Find user by stripe_customer_id
    const { error } = await supabase
      .from('users')
      .update(updateData as never)
      .eq('stripe_customer_id', customerId)

    if (error) {
      console.error('Failed to update Stripe user subscription:', error)
    } else {
      console.log(`✅ Updated Stripe subscription for customer ${customerId}`)
    }
  } catch (error) {
    console.error('Error updating Stripe subscription:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe()
    const payload = await request.text()
    const signature = (await headers()).get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    let event

    if (!endpointSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not configured')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 400 }
      )
    }

    try {
      event = stripe.webhooks.constructEvent(payload, signature, endpointSecret)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      console.error(`Webhook signature verification failed: ${errorMessage}`)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as {
          id: string
          customer?: string
          subscription?: string
          metadata?: { priceId?: string }
        }
        console.log('Payment successful for session:', session.id)
        if (session.customer && session.subscription) {
          await updateUserFromStripe(
            session.customer,
            session.subscription,
            'active',
            session.metadata?.priceId
          )
        }
        break
      }
      case 'invoice.paid': {
        const invoice = event.data.object as {
          id: string
          customer?: string
          subscription?: string
          lines?: { data: Array<{ price?: { id?: string } }> }
        }
        console.log('Invoice paid:', invoice.id)
        if (invoice.customer && invoice.subscription) {
          const priceId = invoice.lines?.data[0]?.price?.id
          await updateUserFromStripe(
            invoice.customer,
            invoice.subscription,
            'active',
            priceId
          )
        }
        break
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as {
          id: string
          customer?: string
          subscription?: string
        }
        console.log('Invoice payment failed:', invoice.id)
        if (invoice.customer && invoice.subscription) {
          await updateUserFromStripe(
            invoice.customer,
            invoice.subscription,
            'past_due'
          )
        }
        break
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object as unknown as {
          id: string
          customer: string
          status: string
          items: { data: Array<{ price: { id: string } }> }
          current_period_start: number
          current_period_end: number
          cancel_at_period_end: boolean
        }
        console.log('Subscription updated:', subscription.id)
        await updateUserFromStripe(
          subscription.customer,
          subscription.id,
          subscription.status,
          subscription.items?.data[0]?.price?.id,
          subscription.current_period_start,
          subscription.current_period_end,
          subscription.cancel_at_period_end
        )
        break
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as unknown as {
          id: string
          customer: string
        }
        console.log('Subscription cancelled:', subscription.id)
        await updateUserFromStripe(
          subscription.customer,
          subscription.id,
          'canceled'
        )
        break
      }
      default:
        console.log(`Unhandled event type: ${event.type}`)
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
