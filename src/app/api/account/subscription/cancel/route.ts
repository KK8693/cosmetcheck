import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cancelSubscription as cancelPayPalSubscription } from '@/lib/paypal'
import { getStripe } from '@/lib/stripe'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
      global: { headers: { Authorization: `Bearer ${token}` } },
    })

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('subscription_provider, stripe_subscription_id, paypal_subscription_id')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const provider = userData.subscription_provider
    const stripeSubId = userData.stripe_subscription_id
    const paypalSubId = userData.paypal_subscription_id

    if (!provider || (!stripeSubId && !paypalSubId)) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 400 }
      )
    }

    // Cancel via provider API
    if (provider === 'stripe' && stripeSubId) {
      const stripe = getStripe()
      await stripe.subscriptions.cancel(stripeSubId)
    } else if (provider === 'paypal' && paypalSubId) {
      await cancelPayPalSubscription(paypalSubId, 'User requested cancellation via account settings')
    }

    // Update database
    const { error: updateError } = await supabase
      .from('users')
      .update({
        subscription_status: 'canceled',
        cancel_at_period_end: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Failed to update subscription status:', updateError)
      return NextResponse.json(
        { error: 'Failed to update subscription status' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription cancelled successfully. You will retain access until the end of your current billing period.',
    })
  } catch (error) {
    console.error('Cancel subscription error:', error)
    const message = error instanceof Error ? error.message : 'Failed to cancel subscription'
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
