import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const email = formData.get('email') as string

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = {
      email: email.toLowerCase().trim(),
      source: 'blog_newsletter',
      created_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from('subscribers')
      .insert(payload)

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { success: true, message: 'Already subscribed!' },
          { status: 200 }
        )
      }
      if (error.code === '42P01') {
        return NextResponse.json(
          { error: 'Subscription service initializing. Please contact admin.' },
          { status: 503 }
        )
      }
      console.error('[Subscribe] Supabase insert error:', error)
      return NextResponse.json(
        { error: 'Failed to save subscription. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Subscribed successfully!' },
      { status: 200 }
    )
  } catch (err) {
    console.error('[Subscribe] Unexpected error:', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
