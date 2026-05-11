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

export type SubscriptionTier = 'free' | 'pro' | 'team'

/**
 * 检查用户是否为 Pro/Team 订阅者
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
  // 白名单配置（临时方案，生产环境应从 Stripe/PayPal 获取）
  const PRO_WHITELIST = new Set([
    'lifaqiang06@gmail.com',
    'stormy@example.com',
    // 添加其他 Pro 用户邮箱
  ])

  // 检查是否为白名单用户
  const normalized = userIdOrEmail.toLowerCase()
  if (PRO_WHITELIST.has(normalized)) {
    return 'pro'
  }

  // TODO: 后续接入真正的订阅检查逻辑
  // 1. 从 Stripe 获取订阅状态
  // 2. 或从本地数据库 users 表查询 subscription_tier 字段
  
  return 'free'
}

/**
 * 检查批量检测功能是否可用（仅 Pro 可用）
 * 
 * @param userIdOrEmail - 用户 ID 或邮箱
 * @returns Promise<{ allowed: boolean; tier: SubscriptionTier }>
 */
export async function checkBatchAccess(
  userIdOrEmail: string
): Promise<{ allowed: boolean; tier: SubscriptionTier }> {
  const tier = await checkSubscriptionTier(userIdOrEmail)
  
  return {
    allowed: tier === 'pro' || tier === 'team',
    tier,
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