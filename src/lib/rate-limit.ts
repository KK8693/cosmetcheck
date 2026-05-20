/**
 * Token Bucket Rate Limiter - Edge Runtime Compatible with Supabase Persistence
 *
 * Uses Supabase for persistent state storage across serverless instances.
 * Requires the migration: 20250520_fix_serverless_state.sql
 */

import { createClient } from '@supabase/supabase-js'

export interface RateLimitConfig {
  /** Requests per minute (RPM) */
  rpm: number
  /** Burst capacity (how many requests can be made instantly) */
  burst?: number
  /** Window size in ms (default: 60000ms = 1 minute) */
  windowMs?: number
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetInMs: number
  retryAfterMs?: number
}

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
  if (!url || !key) {
    throw new Error('Missing Supabase environment variables for rate limiting')
  }
  return createClient(url, key)
}

/**
 * Default configurations for different endpoints
 */
export const RATE_LIMIT_CONFIGS = {
  // AI generation - stricter due to API costs
  generate: { rpm: 10, burst: 3, windowMs: 60000 },
  // Compliance check - moderate
  check: { rpm: 30, burst: 10, windowMs: 60000 },
  // Batch operations - very strict
  batch: { rpm: 5, burst: 2, windowMs: 60000 },
  // Default for unknown endpoints
  default: { rpm: 30, burst: 10, windowMs: 60000 },
} as const

/**
 * Create a custom rate limiter with specific configuration
 */
export function createRateLimiter(config: RateLimitConfig) {
  const { rpm, burst = Math.ceil(rpm / 6), windowMs = 60000 } = config

  return {
    async check(identifier: string): Promise<RateLimitResult> {
      return checkTokenBucket(identifier, rpm, burst, windowMs)
    },

    /**
     * Reset the rate limit for an identifier (useful for testing)
     */
    async reset(identifier: string): Promise<void> {
      try {
        const supabase = getSupabaseAdmin()
        await supabase.from('rate_limits').delete().eq('identifier', identifier)
      } catch (e) {
        console.error('[rate-limit] Reset error:', e)
      }
    },

    /**
     * Get current state for monitoring
     */
    async getState(identifier: string) {
      try {
        const supabase = getSupabaseAdmin()
        const { data } = await supabase
          .from('rate_limits')
          .select('*')
          .eq('identifier', identifier)
          .single()
        return data || null
      } catch {
        return null
      }
    }
  }
}

/**
 * Default rate limiter for AI generation endpoints
 */
export const generateRateLimiter = createRateLimiter(RATE_LIMIT_CONFIGS.generate)

/**
 * Check rate limit using the default AI generation limiter
 * @param identifier - Unique identifier (user ID, IP, etc.)
 * @param customRpm - Optional custom RPM override
 */
export async function checkRateLimit(
  identifier: string,
  customRpm?: number
): Promise<RateLimitResult> {
  let config: { rpm: number; burst: number; windowMs: number }

  if (customRpm) {
    config = { rpm: customRpm, burst: Math.ceil(customRpm / 6), windowMs: 60000 }
  } else {
    config = RATE_LIMIT_CONFIGS.generate as { rpm: number; burst: number; windowMs: number }
  }

  return checkTokenBucket(identifier, config.rpm, config.burst, config.windowMs)
}

/**
 * Core token bucket algorithm with Supabase persistence
 *
 * @param identifier - Unique key for this bucket
 * @param rpm - Requests per minute
 * @param burst - Maximum tokens (burst capacity)
 * @param windowMs - Time window in milliseconds
 */
async function checkTokenBucket(
  identifier: string,
  rpm: number,
  burst: number,
  windowMs: number
): Promise<RateLimitResult> {
  try {
    const supabase = getSupabaseAdmin()

    // Try atomic RPC first (best for concurrency)
    try {
      const { data, error } = await supabase.rpc('check_rate_limit_rpc', {
        p_identifier: identifier,
        p_rpm: rpm,
        p_burst: burst,
        p_window_ms: windowMs,
      })

      if (!error && data && data.length > 0) {
        const result = data[0]
        return {
          allowed: result.allowed,
          remaining: result.remaining,
          resetInMs: result.reset_in_ms,
        }
      }
    } catch (rpcError) {
      // RPC not available (migration not run yet), fall through to direct table ops
      console.warn('[rate-limit] RPC unavailable, using direct table ops:', rpcError)
    }

    // Fallback: direct table read-update (best-effort in concurrent scenarios)
    const now = Date.now()
    const { data: bucket, error: fetchError } = await supabase
      .from('rate_limits')
      .select('tokens, last_refill, max_tokens')
      .eq('identifier', identifier)
      .single()

    if (fetchError || !bucket) {
      // Create new bucket
      await supabase.from('rate_limits').upsert({
        identifier,
        tokens: burst - 1,
        last_refill: now,
        max_tokens: burst,
      })
      return { allowed: true, remaining: burst - 1, resetInMs: windowMs }
    }

    // Calculate refill
    const timeElapsed = now - bucket.last_refill
    const tokensToAdd = Math.floor((timeElapsed / windowMs) * rpm)

    let newTokens = bucket.tokens
    if (tokensToAdd > 0) {
      newTokens = Math.min(bucket.max_tokens, bucket.tokens + tokensToAdd)
    }

    if (newTokens >= 1) {
      newTokens -= 1
      await supabase.from('rate_limits').upsert({
        identifier,
        tokens: newTokens,
        last_refill: now,
        max_tokens: burst,
      })
      return { allowed: true, remaining: Math.floor(newTokens), resetInMs: windowMs }
    }

    // No tokens available
    const tokensNeeded = 1 - newTokens
    const retryAfterMs = Math.ceil((tokensNeeded / rpm) * windowMs)

    return {
      allowed: false,
      remaining: 0,
      resetInMs: windowMs,
      retryAfterMs,
    }
  } catch (e) {
    console.error('[rate-limit] Error, falling back to permissive:', e)
    // Fail-open on catastrophic error to avoid blocking all traffic
    return { allowed: true, remaining: 1, resetInMs: windowMs }
  }
}

/**
 * Reset all rate limits (useful for testing or admin operations)
 */
export async function resetAllRateLimits(): Promise<void> {
  try {
    const supabase = getSupabaseAdmin()
    await supabase.from('rate_limits').delete().neq('identifier', '')
  } catch (e) {
    console.error('[rate-limit] Reset all error:', e)
  }
}
