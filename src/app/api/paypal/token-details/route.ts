import { NextRequest, NextResponse } from 'next/server'
import { getPayPalAccessToken } from '@/lib/paypal'

export const runtime = 'edge'

/**
 * 兑换 PayPal token 获取订阅详情
 * PayPal 回调时带的是 token，不是 subscription_id
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json(
      { error: 'token is required' },
      { status: 400 }
    )
  }

  try {
    const accessToken = await getPayPalAccessToken()
    const PAYPAL_API_BASE = process.env.PAYPAL_ENVIRONMENT === 'sandbox'
      ? 'https://api-m.sandbox.paypal.com'
      : 'https://api-m.paypal.com'

    // 用 token 换取订阅详情
    const response = await fetch(
      `${PAYPAL_API_BASE}/v1/billing/subscriptions/token-details?token=${token}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error('Token details error:', error)
      return NextResponse.json(
        { error: 'Failed to get subscription from token' },
        { status: 500 }
      )
    }

    const data = await response.json()
    return NextResponse.json({
      subscriptionId: data.subscription_id,
      status: data.status,
    })
  } catch (error) {
    console.error('Token redemption error:', error)
    return NextResponse.json(
      { error: 'Failed to redeem token' },
      { status: 500 }
    )
  }
}