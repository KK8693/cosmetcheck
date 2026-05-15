/**
 * Token Bucket Rate Limiter - Edge Runtime Compatible
 * 
 * A lightweight rate limiter using the token bucket algorithm.
 * Works in Cloudflare Workers (Edge Runtime) without external dependencies.
 * 
 * Usage:
 *   import { checkRateLimit, createRateLimiter } from '@/lib/rate-limit'
 * 
 *   // Simple global limiter (30 requests/minute)
 *   checkRateLimit(identifier)
 * 
 *   // Custom limiter per endpoint
 *   const limiter = createRateLimiter({ rpm: 10, burst: 5 })
 *   limiter.check(userId)
 */

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

interface TokenBucket {
  tokens: number
  lastRefill: number
  maxTokens: number
}

/**
 * Global rate limit store (in-memory, per-instance)
 * Note: In multi-instance部署, each instance has its own limit
 */
const buckets = new Map<string, TokenBucket>()

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
    check(identifier: string): RateLimitResult {
      return checkTokenBucket(identifier, rpm, burst, windowMs)
    },
    
    /**
     * Reset the rate limit for an identifier (useful for testing)
     */
    reset(identifier: string): void {
      buckets.delete(identifier)
    },
    
    /**
     * Get current state for monitoring
     */
    getState(identifier: string): TokenBucket | undefined {
      return buckets.get(identifier)
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
export function checkRateLimit(
  identifier: string, 
  customRpm?: number
): RateLimitResult {
  const config = customRpm 
    ? { rpm: customRpm, burst: Math.ceil(customRpm / 6) }
    : RATE_LIMIT_CONFIGS.generate
    
  return checkTokenBucket(identifier, config.rpm, config.burst, config.windowMs)
}

/**
 * Core token bucket algorithm
 * 
 * @param identifier - Unique key for this bucket
 * @param rpm - Requests per minute
 * @param burst - Maximum tokens (burst capacity)
 * @param windowMs - Time window in milliseconds
 */
function checkTokenBucket(
  identifier: string,
  rpm: number,
  burst: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now()
  let bucket = buckets.get(identifier)
  
  // Initialize bucket if doesn't exist
  if (!bucket) {
    bucket = {
      tokens: burst,
      lastRefill: now,
      maxTokens: burst,
    }
    buckets.set(identifier, bucket)
    
    return {
      allowed: true,
      remaining: burst - 1,
      resetInMs: windowMs,
    }
  }
  
  // Calculate tokens to add based on time elapsed
  const timeElapsed = now - bucket.lastRefill
  const tokensToAdd = Math.floor((timeElapsed / windowMs) * rpm)
  
  if (tokensToAdd > 0) {
    bucket.tokens = Math.min(bucket.maxTokens, bucket.tokens + tokensToAdd)
    bucket.lastRefill = now
  }
  
  // Check if we have tokens available
  if (bucket.tokens >= 1) {
    bucket.tokens -= 1
    
    const result: RateLimitResult = {
      allowed: true,
      remaining: Math.floor(bucket.tokens),
      resetInMs: windowMs,
    }
    
    // Cleanup old buckets periodically (5% chance per request)
    if (Math.random() < 0.05) {
      cleanupOldBuckets(now, windowMs * 2)
    }
    
    return result
  }
  
  // No tokens available - calculate retry time
  const tokensNeeded = 1 - bucket.tokens
  const retryAfterMs = Math.ceil((tokensNeeded / rpm) * windowMs)
  
  return {
    allowed: false,
    remaining: 0,
    resetInMs: windowMs,
    retryAfterMs,
  }
}

/**
 * Clean up stale buckets to prevent memory leaks
 */
function cleanupOldBuckets(now: number, maxAge: number): void {
  for (const [key, bucket] of buckets.entries()) {
    if (now - bucket.lastRefill > maxAge) {
      buckets.delete(key)
    }
  }
}

/**
 * Get rate limit info for monitoring
 */
export function getRateLimitInfo(identifier: string): {
  exists: boolean
  tokens: number
  maxTokens: number
  lastRefill: number
} | null {
  const bucket = buckets.get(identifier)
  if (!bucket) return null
  
  return {
    exists: true,
    tokens: bucket.tokens,
    maxTokens: bucket.maxTokens,
    lastRefill: bucket.lastRefill,
  }
}

/**
 * Reset all rate limits (useful for testing or admin operations)
 */
export function resetAllRateLimits(): void {
  buckets.clear()
}