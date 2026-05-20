import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const FREE_QUOTA = 10
const RESET_DAYS = 30

// Whitelist: load from env or empty set (DO NOT hardcode emails in production)
const QUOTA_WHITELIST = new Set<string>(
  process.env.QUOTA_WHITELIST?.split(',').map(s => s.trim().toLowerCase()) || []
)

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
  if (!url || !key) {
    throw new Error('Missing Supabase environment variables for quota service')
  }
  return createClient(url, key)
}

function getResetDate(): Date {
  const now = new Date()
  return new Date(now.getTime() + RESET_DAYS * 24 * 60 * 60 * 1000)
}

export async function getQuotaStatus(identifier: string): Promise<{
  used: number
  limit: number
  remaining: number
  resetAt: Date
}> {
  if (QUOTA_WHITELIST.has(identifier.toLowerCase())) {
    return {
      used: 0,
      limit: Infinity,
      remaining: Infinity,
      resetAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    }
  }

  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('user_quotas')
      .select('count, reset_at')
      .eq('identifier', identifier)
      .single()

    const now = new Date()

    if (error || !data || new Date(data.reset_at) < now) {
      const resetAt = getResetDate()
      await supabase.from('user_quotas').upsert({
        identifier,
        count: 0,
        reset_at: resetAt.toISOString(),
      })
      return { used: 0, limit: FREE_QUOTA, remaining: FREE_QUOTA, resetAt }
    }

    const used = data.count
    return {
      used,
      limit: FREE_QUOTA,
      remaining: Math.max(0, FREE_QUOTA - used),
      resetAt: new Date(data.reset_at),
    }
  } catch (e) {
    console.error('[quota] DB error, falling back to permissive mode:', e)
    return { used: 0, limit: FREE_QUOTA, remaining: FREE_QUOTA, resetAt: getResetDate() }
  }
}

export async function incrementQuota(identifier: string): Promise<boolean> {
  if (QUOTA_WHITELIST.has(identifier.toLowerCase())) return true

  try {
    const status = await getQuotaStatus(identifier)
    if (status.remaining <= 0) return false

    const supabase = getSupabaseAdmin()
    const { error } = await supabase.from('user_quotas').upsert({
      identifier,
      count: status.used + 1,
      reset_at: status.resetAt.toISOString(),
    })

    if (error) {
      console.error('[quota] Failed to increment:', error)
      return false
    }
    return true
  } catch (e) {
    console.error('[quota] Increment error:', e)
    return false
  }
}

export async function checkQuotaMiddleware(
  request: NextRequest
): Promise<{ allowed: boolean; response?: NextResponse }> {
  const userEmail = request.headers.get('x-user-email')

  if (userEmail && QUOTA_WHITELIST.has(userEmail.toLowerCase())) {
    return { allowed: true }
  }

  const identifier =
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    'anonymous'

  const status = await getQuotaStatus(identifier)

  if (status.remaining <= 0) {
    return {
      allowed: false,
      response: NextResponse.json(
        {
          error: 'Free quota exceeded',
          message: `You have used ${status.used} of ${status.limit} free checks. Please upgrade to Pro for unlimited access.`,
          quota: status,
        },
        { status: 429 }
      ),
    }
  }

  return { allowed: true }
}
