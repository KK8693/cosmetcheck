import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory quota tracking (replace with DB in production)
const quotaStore = new Map<string, { count: number; resetAt: Date }>()

const FREE_QUOTA = 10
const RESET_DAYS = 30

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
  // Get identifier from IP or user ID
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
