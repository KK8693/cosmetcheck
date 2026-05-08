import { NextRequest, NextResponse } from 'next/server'
import { createSubscription, PLANS } from '@/lib/paypal'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { planId, customerId } = body

    // Validate plan ID
    const validPlanIds = Object.values(PLANS)
    if (!planId || !validPlanIds.includes(planId as typeof PLANS[keyof typeof PLANS])) {
      return NextResponse.json(
        { error: 'Invalid plan ID. Must be one of: ' + validPlanIds.join(', ') },
        { status: 400 }
      )
    }

    const result = await createSubscription(planId, customerId)

    if (!result.approvalUrl) {
      return NextResponse.json(
        { error: 'Failed to get approval URL from PayPal' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      subscriptionId: result.subscriptionId,
      approvalUrl: result.approvalUrl,
    })
  } catch (error) {
    console.error('PayPal subscription error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create subscription' },
      { status: 500 }
    )
  }
}

// GET endpoint to check subscription status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const subscriptionId = searchParams.get('subscription_id')

  if (!subscriptionId) {
    return NextResponse.json(
      { error: 'subscription_id is required' },
      { status: 400 }
    )
  }

  try {
    const { getSubscription } = await import('@/lib/paypal')
    const subscription = await getSubscription(subscriptionId)
    return NextResponse.json(subscription)
  } catch (error) {
    console.error('Get subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to get subscription' },
      { status: 500 }
    )
  }
}