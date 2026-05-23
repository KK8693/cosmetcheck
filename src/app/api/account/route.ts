import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
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
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    if (userError) {
      console.error('Failed to fetch user data:', userError)
      return NextResponse.json(
        { error: 'Failed to fetch user data' },
        { status: 500 }
      )
    }

    // 如果用户记录不存在（trigger 未生效或未部署），自动创建默认记录
    let finalUserData = userData
    if (!finalUserData) {
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          subscription_tier: 'free',
          quota_used: 0,
          quota_limit: 10,
        })
        .select()
        .single()

      if (insertError) {
        console.error('Failed to create user record:', insertError)
        return NextResponse.json(
          { error: 'Failed to create user record' },
          { status: 500 }
        )
      }

      finalUserData = newUser
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: finalUserData?.full_name || null,
        subscriptionTier: finalUserData?.subscription_tier || 'free',
        subscriptionProvider: finalUserData?.subscription_provider || null,
        subscriptionStatus: finalUserData?.subscription_status || null,
        subscriptionPlan: finalUserData?.subscription_plan || null,
        currentPeriodStart: finalUserData?.current_period_start || null,
        currentPeriodEnd: finalUserData?.current_period_end || null,
        cancelAtPeriodEnd: finalUserData?.cancel_at_period_end || false,
        quotaUsed: finalUserData?.quota_used || 0,
        quotaLimit: finalUserData?.quota_limit || 10,
      },
    })
  } catch (error) {
    console.error('Account API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
