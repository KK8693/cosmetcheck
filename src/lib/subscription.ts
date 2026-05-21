import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Lazy initialization for Edge Runtime compatibility
let _supabaseAdmin: ReturnType<typeof createClient> | null = null

function getSupabaseAdmin() {
  if (!_supabaseAdmin) {
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables')
    }
    _supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
  }
  return _supabaseAdmin
}

export type SubscriptionTier = 'free' | 'pro-monthly' | 'pro-annual' | 'team'

/**
 * 检查用户订阅等级（含月付/年付区分）
 *
 * 当前实现：检查用户邮箱是否在白名单中（临时方案）
 * 后续应接入 Stripe/PayPal 订阅数据进行真正的订阅状态检查
 *
 * @param userIdOrEmail - 用户 ID 或邮箱
 * @returns Promise<SubscriptionTier>
 */
export async function checkSubscriptionTier(
  userIdOrEmail: string
): Promise<SubscriptionTier> {
  // 年付白名单（临时方案，生产环境应从 Stripe/PayPal 获取）
  const PRO_ANNUAL_WHITELIST = new Set<string>([
    'lifaqiang06@gmail.com',
    'stormy@example.com',
    // 添加其他年付 Pro 用户邮箱
  ])

  // 月付白名单（临时方案）
  const PRO_MONTHLY_WHITELIST = new Set<string>([
    // 'monthly@example.com',
  ])

  const normalized = userIdOrEmail.toLowerCase()

  if (PRO_ANNUAL_WHITELIST.has(normalized)) {
    return 'pro-annual'
  }

  if (PRO_MONTHLY_WHITELIST.has(normalized)) {
    return 'pro-monthly'
  }

  // TODO: 后续接入真正的订阅检查逻辑
  // 1. 从 Stripe 获取订阅状态
  // 2. 或从本地数据库 users 表查询 subscription_tier + billing_cycle 字段

  return 'free'
}

/**
 * 检查批量检测功能是否可用（仅年付 Pro 可用）
 *
 * @param userIdOrEmail - 用户 ID 或邮箱
 * @returns Promise<{ allowed: boolean; tier: SubscriptionTier; reason?: string }>
 */
export async function checkBatchAccess(
  userIdOrEmail: string
): Promise<{ allowed: boolean; tier: SubscriptionTier; reason?: string }> {
  const tier = await checkSubscriptionTier(userIdOrEmail)

  if (tier === 'pro-annual' || tier === 'team') {
    return { allowed: true, tier }
  }

  if (tier === 'pro-monthly') {
    return {
      allowed: false,
      tier,
      reason: 'batch_requires_annual',
    }
  }

  return {
    allowed: false,
    tier,
    reason: 'requires_pro_annual',
  }
}

/**
 * 检查 AI 聊天功能权限
 *
 * @param userIdOrEmail - 用户 ID 或邮箱
 * @param mode - 'support' | 'advisor'
 * @returns Promise<{ allowed: boolean; tier: SubscriptionTier; reason?: string }>
 */
export async function checkChatAccess(
  userIdOrEmail: string,
  mode: 'support' | 'advisor'
): Promise<{ allowed: boolean; tier: SubscriptionTier; reason?: string }> {
  const tier = await checkSubscriptionTier(userIdOrEmail)

  // Support mode: all tiers allowed (free has daily limit checked client-side)
  if (mode === 'support') {
    return { allowed: true, tier }
  }

  // Advisor mode: pro-annual or team only
  if (tier === 'pro-annual' || tier === 'team') {
    return { allowed: true, tier }
  }

  if (tier === 'pro-monthly') {
    return {
      allowed: false,
      tier,
      reason: 'advisor_requires_annual',
    }
  }

  return {
    allowed: false,
    tier,
    reason: 'requires_pro_annual',
  }
}

/**
 * 检查用户是否已认证（用于需要登录的 API）
 *
 * @param authHeader - Authorization header
 * @returns Promise<{ authenticated: boolean; userId?: string; email?: string }>
 */
export async function verifyAuth(authHeader?: string | null): Promise<{
  authenticated: boolean
  userId?: string
  email?: string
}> {
  // 如果没有 auth header，尝试通过邮箱 header 获取（用于临时开发）
  if (!authHeader) {
    return { authenticated: false }
  }

  // 解析 Bearer token（如果后续接入完整认证系统）
  if (authHeader.startsWith('Bearer ')) {
    // TODO: 解析 JWT 并获取用户信息
    // 暂时返回未认证状态，等待完整认证系统接入
  }

  return { authenticated: false }
}
