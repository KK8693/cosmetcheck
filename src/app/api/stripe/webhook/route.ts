import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { headers } from 'next/headers'

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

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

    if (endpointSecret) {
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
    } else {
      // For development without webhook secret
      event = JSON.parse(payload)
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        console.log('Payment successful for session:', session.id)
        // TODO: Update user subscription in database
        break
      }
      case 'invoice.paid': {
        const invoice = event.data.object
        console.log('Invoice paid:', invoice.id)
        // TODO: Update user subscription period
        break
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object
        console.log('Invoice payment failed:', invoice.id)
        // TODO: Handle failed payment
        break
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        console.log('Subscription cancelled:', subscription.id)
        // TODO: Downgrade user to free tier
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

export const config = {
  api: {
    bodyParser: false,
  },
}
