import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory quota tracking (replace with DB in production)
const quotaStore = new Map<string, { count: number; resetAt: Date }>()

const FREE_QUOTA = 10
const RESET_DAYS = 30

// Whitelist of emails that bypass quota limits (for testing/VIP users)
const QUOTA_WHITELIST = new Set([
  'lifaqiang06@gmail.com',
  'stormy@example.com', // Add more emails here
])

function getResetDate(): Date {
  const now = new Date()
  return new Date(now.getTime() + RESET_DAYS * 24 * 60 * 60 * 1000)
}

export function getQuotaStatus(identifier: string): {
  used: number
  limit: number
  remaining: number
  resetAt: Date
} {
  // Check if identifier is whitelisted (email-based bypass)
  if (QUOTA_WHITELIST.has(identifier.toLowerCase())) {
    return {
      used: 0,
      limit: Infinity,
      remaining: Infinity,
      resetAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    }
  }

  const now = new Date()
  let record = quotaStore.get(identifier)

  if (!record || now > record.resetAt) {
    record = { count: 0, resetAt: getResetDate() }
    quotaStore.set(identifier, record)
  }

  return {
    used: record.count,
    limit: FREE_QUOTA,
    remaining: Math.max(0, FREE_QUOTA - record.count),
    resetAt: record.resetAt,
  }
}

export function incrementQuota(identifier: string): boolean {
  // Skip quota increment for whitelisted users
  if (QUOTA_WHITELIST.has(identifier.toLowerCase())) {
    return true
  }
  
  const status = getQuotaStatus(identifier)

  if (status.remaining <= 0) {
    return false
  }

  const record = quotaStore.get(identifier)!
  record.count += 1
  return true
}

export function checkQuotaMiddleware(
  request: NextRequest
): { allowed: boolean; response?: NextResponse } {
  // First check if user email is provided in header (for authenticated users)
  const userEmail = request.headers.get('x-user-email')
  
  // If user email is provided and is whitelisted, allow unlimited access
  if (userEmail && QUOTA_WHITELIST.has(userEmail.toLowerCase())) {
    return { allowed: true }
  }
  
  // Otherwise, use IP-based quota (existing behavior)
  const identifier =
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    'anonymous'

  const status = getQuotaStatus(identifier)

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
