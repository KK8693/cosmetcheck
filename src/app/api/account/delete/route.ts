import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')

    // 创建 Supabase admin 客户端
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const userId = user.id

    // 按顺序删除数据：先删除依赖数据，再删除主数据

    // 1. 删除用户的合规检测记录（如果表存在）
    try {
      await supabaseAdmin
        .from('compliance_checks')
        .delete()
        .eq('user_id', userId)
    } catch (e) {
      console.log('No compliance_checks table or error:', e)
    }

    // 2. 删除用户的 AI 生成记录（如果表存在）
    try {
      await supabaseAdmin
        .from('generated_listings')
        .delete()
        .eq('user_id', userId)
    } catch (e) {
      console.log('No generated_listings table or error:', e)
    }

    // 3. 删除用户记录
    const { error: userError } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', userId)

    if (userError) {
      console.error('Error deleting user record:', userError)
    }

    // 4. 删除 Supabase Auth 用户（这会级联删除相关数据）
    const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (deleteAuthError) {
      console.error('Error deleting auth user:', deleteAuthError)
      return NextResponse.json(
        { error: 'Failed to delete account completely' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Account and all associated data have been deleted'
    })

  } catch (error) {
    console.error('Delete account error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}