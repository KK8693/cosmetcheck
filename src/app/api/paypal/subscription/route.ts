import { NextRequest, NextResponse } from 'next/server'
import { getAccessToken, PLANS } from '@/lib/paypal'

export const runtime = 'edge'

/**
 * PayPal Subscription API
 * 
 * POST /api/paypal/subscription
 * Body: { planId?: string }
 * Returns: { approvalUrl, subscriptionId }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const planId = body.planId || PLANS.PRO_MONTHLY
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://preview.cosmetcheck.pages.dev'
    const successUrl = body.successUrl || `${appUrl}/success`
    const cancelUrl = body.cancelUrl || `${appUrl}/pricing`

    // Validate plan
    const validPlans = Object.values(PLANS)
    if (!validPlans.includes(planId)) {
      return NextResponse.json(
        { error: 'Invalid plan ID' },
        { status: 400 }
      )
    }

    const token = await getAccessToken()
    const baseUrl = process.env.PAYPAL_ENVIRONMENT === 'production'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com'

    // Create subscription
    const response = await fetch(`${baseUrl}/v1/billing/subscriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plan_id: planId,
        application_context: {
          brand_name: 'CosmetCheck',
          locale: 'en-US',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'SUBSCRIBE_NOW',
          return_url: successUrl,
          cancel_url: cancelUrl,
        },
      }),
    })

    const responseText = await response.text()
    console.log('PayPal response status:', response.status)
    console.log('PayPal response body:', responseText)

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to create subscription', details: responseText },
        { status: 500 }
      )
    }

    const subscription = await response.json()

    // Find the approve link
    const approveLink = subscription.links?.find(
      (link: { rel: string }) => link.rel === 'approve'
    )

    if (!approveLink) {
      return NextResponse.json(
        { error: 'No approval URL found' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      subscriptionId: subscription.id,
      approvalUrl: approveLink.href,
      status: subscription.status,
    })
  } catch (error) {
    console.error('Subscription API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/paypal/subscription?id=XXX
 * Check subscription status
 */
export async function GET(request: NextRequest) {
  try {
    const subscriptionId = request.nextUrl.searchParams.get('id')

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID required' },
        { status: 400 }
      )
    }

    const token = await getAccessToken()
    const baseUrl = process.env.PAYPAL_ENVIRONMENT === 'production'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com'

    const response = await fetch(
      `${baseUrl}/v1/billing/subscriptions/${subscriptionId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    const subscription = await response.json()

    return NextResponse.json({
      id: subscription.id,
      status: subscription.status,
      planId: subscription.plan_id,
      startTime: subscription.start_time,
      nextBillingTime: subscription.billing_info?.next_billing_time,
    })
  } catch (error) {
    console.error('Subscription check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}