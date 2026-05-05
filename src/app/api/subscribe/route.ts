import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: '请提供邮箱地址' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '邮箱格式不正确' },
        { status: 400 }
      )
    }

    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json(
        { error: '数据库服务暂时不可用' },
        { status: 503 }
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = {
      email: email.toLowerCase().trim(),
      source: 'footer_cta',
      created_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from('subscribers')
      .insert(payload)

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: '该邮箱已订阅' },
          { status: 409 }
        )
      }
      if (error.code === '42P01') {
        return NextResponse.json(
          { error: '订阅服务初始化中，请联系管理员' },
          { status: 503 }
        )
      }
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { error: '订阅失败，请稍后重试' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: '订阅成功' },
      { status: 200 }
    )
  } catch (err) {
    console.error('Subscribe API error:', err)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}
