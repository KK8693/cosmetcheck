# M1a 研发任务清单：GA4 埋点开发

> **依赖**：ADR-001 Analytics Tracking Architecture
> **排期**：M1a Week 1-2（预休3-4个研发日）
> **审批状态**：待 CTO 最终批准

---

## 任务总览

| 任务 ID | 名称 | 估算工时 | 优先级 | 前置依赖 |
|---------|------|----------|--------|----------|
| T1 | 核心工具库 (`lib/analytics.ts`) | 0.5d | P0 | — |
| T2 | Analytics 组件扩展 + User-ID 同步 | 0.5d | P0 | T1 |
| T3 | 前端事件埋点（认证/产品/订阅流程） | 1.5d | P0 | T2 |
| T4 | 服务端 Measurement Protocol 发送器 | 0.5d | P0 | — |
| T5 | 后端事件埋点（检测/支付 Webhook） | 0.5d | P0 | T4 |
| T6 | 自定义维度后端支持 + 数据库字段确认 | 0.5d | P0 | — |
| T7 | 本地测试 + DebugView 验证 | 0.5d | P0 | T3, T5 |

---

## T1: 核心工具库 `src/lib/analytics.ts`

**目标**：创建类型安全的 GA4 事件发送封装层。

**新增文件**：`src/lib/analytics.ts`

**核心接口设计**：

```typescript
// 事件名称（严格匹配运营计划埋点清单）
export type AnalyticsEventName =
  | 'sign_up'
  | 'login'
  | 'product_upload'
  | 'analysis_start'
  | 'analysis_complete'
  | 'report_view'
  | 'report_export'
  | 'subscription_initiated'
  | 'subscription_completed'
  | 'subscription_cancelled'
  | 'checkout_abandoned'
  | 'feature_used'
  | 'help_doc_viewed'
  | 'support_ticket_created'
  | 'quota_warning'          // 为 M1b 预留

// 各事件参数定义（严格匹配运营清单）
export interface EventParamsMap {
  sign_up: { method: 'email' | 'google' }
  login: { method: 'email' | 'google' }
  product_upload: { product_type: string; source: 'manual' | 'file' }
  analysis_start: { regulation: 'anvisa' | 'cofepris' }
  analysis_complete: { regulation: 'anvisa' | 'cofepris'; result_status: 'pass' | 'fail' | 'warn' }
  report_view: { regulation: 'anvisa' | 'cofepris' }
  report_export: { format: 'pdf' | 'excel' }
  subscription_initiated: { plan: 'monthly' | 'yearly'; provider?: 'stripe' | 'paypal' }
  subscription_completed: { plan: 'monthly' | 'yearly'; value: number; currency: string; provider: 'stripe' | 'paypal' }
  subscription_cancelled: { plan: 'monthly' | 'yearly'; reason?: string }
  checkout_abandoned: { plan: 'monthly' | 'yearly'; time_on_page: number }
  feature_used: { feature_name: string }
  help_doc_viewed: { doc_title: string }
  support_ticket_created: { category: string }
  quota_warning: { percent: 80 | 100 }
}

// 自定义维度
export interface AnalyticsDimensions {
  user_type: 'free' | 'trial' | 'paid'
  preferred_language: 'pt-BR' | 'es-MX' | 'en'
  signup_source: 'organic' | 'referral' | 'direct' | 'social'
  first_referral_domain?: string
}

// 核心函数
export function trackEvent<T extends AnalyticsEventName>(
  eventName: T,
  params: EventParamsMap[T]
): void

export function setUserProperties(props: Partial<AnalyticsDimensions>): void
export function setUserId(userId: string | null): void
export function captureSignupSource(): { source: string; domain?: string }
```

**实现要点**：
1. 检测 `typeof window !== 'undefined' && typeof gtag !== 'undefined'`
2. `debug_mode: true` 在非生产环境自动添加
3. 所有调用打印到 `console.log('[Analytics]', eventName, params)` 以便本地调试
4. `captureSignupSource()` 逻辑：首次执行时检查 `localStorage.getItem('cc_first_referrer')`，若不存在，写入 `document.referrer`，并解析为分类来源

---

## T2: Analytics 组件扩展

**目标**：在用户认证状态变化时自动同步 User-ID 和用户属性。

**修改文件**：`src/components/Analytics.tsx`

**变更点**：
1. 添加 `useEffect` 监听 `window.__analytics_debug` 切换
2. 暴露 `setUserId` 和 `setUserProperties` 给外部调用
3. IP 匿名化配置：`gtag('config', GA_ID, { anonymize_ip: true })`

**新增 React Hook**：`src/hooks/useAnalytics.ts`

```typescript
// 使用示例
const { trackEvent, setPageView } = useAnalytics()

// 在页面组件中
useEffect(() => {
  setPageView(pathname)  // 解决 App Router SPA 路由页面浏览事件丢失问题
}, [pathname])
```

---

## T3: 前端事件埋点

### 3.1 认证流程 (`src/contexts/AuthContext.tsx`)

**埋点**：
- `signUp()` 成功后发送 `sign_up` 事件，方法固定为 `email`（目前只支持邮箱）
- `signIn()` 成功后发送 `login` 事件
- `signIn()` / `signUp()` 成功后调用 `setUserId(session.user.id)`
- 首次登录时调用 `captureSignupSource()` 将来源信息写入 users 表（若尚未写入）

### 3.2 产品上传与检测流程

**需要查看的文件**：
- `src/components/batch/BatchContent.tsx` 或主页面的产品上传组件

**埋点**（待确认具体组件后实施）：
- 点击"开始检测"/"上传"按钮时：`product_upload` + `analysis_start`
- 检测请求发起前记录 `analysis_start`，用 `regulation` 参数（BR → 'anvisa', MX → 'cofepris'）

### 3.3 报告查看与导出

**埋点**：
- 查看结果页面时：`report_view`
- 点击导出按钮时：`report_export`（format 根据实际支持的格式填写）

### 3.4 订阅流程 (`src/app/[locale]/pricing/PricingContent.tsx`)

**埋点**：
- 点击"Upgrade to Pro"/"订阅"按钮时：`subscription_initiated`
  - `plan`: monthly 或 yearly（根据 toggle 状态）
  - `provider`: stripe 或 paypal（根据按钮类型）
- 离开 `/pricing` 页面时检测是否已发起订阅，未发起则发送 `checkout_abandoned`
  - `time_on_page`: 页面停留时间（秒）

### 3.5 账户页 (`src/app/[locale]/account/page.tsx`)

**埋点**：
- 点击"取消订阅"按钮时：`subscription_cancelled`（前端补充事件，后端 webhook 为主）

---

## T4: 服务端 Measurement Protocol 发送器

**目标**：在 Cloudflare Edge Runtime 中可靠发送后端事件到 GA4。

**新增文件**：`src/lib/analytics-server.ts`

**核心实现**：

```typescript
export async function sendServerEvent(
  eventName: AnalyticsEventName,
  params: EventParamsMap[typeof eventName],
  context: {
    clientId: string        // GA4 客户端 ID (_ga cookie 或 生成的 UUID)
    userId?: string         // Supabase user.id
    userProperties?: Partial<AnalyticsDimensions>
  }
): Promise<void>
```

**实现细节**：
1. 目标端点：`https://www.google-analytics.com/mp/collect?measurement_id=${GA_ID}&api_secret=${API_SECRET}`
2. 请求体格式严格遵循 [GA4 Measurement Protocol v2](https://developers.google.com/analytics/devguides/collection/protocol/ga4)
3. Edge Runtime 无 Node.js 模块，只能使用 `fetch`
4. 非阻塞调用：使用 `await` 但包裹在 `try/catch` 中，不影响主业务响应时间

**环境变量**：新增 `GA_API_SECRET`（服务端秘钥）

---

## T5: 后端事件埋点

### 5.1 检测完成 (`src/app/api/check/route.ts`)

**埋点**：在 `POST` 处理函数成功返回前，发送 `analysis_complete`

```typescript
// 在检测成功后
await sendServerEvent('analysis_complete', {
  regulation: country === 'BR' ? 'anvisa' : 'cofepris',
  result_status: result.violations.length > 0 ? 'fail' : result.warnings.length > 0 ? 'warn' : 'pass',
}, {
  clientId: extractClientId(request),  // 从 Cookie 或 Header 中读取
  userId: request.headers.get('x-user-id') || undefined,
})
```

### 5.2 支付完成

**Stripe Webhook** (`src/app/api/stripe/webhook/route.ts`)
- 在 `checkout.session.completed` 事件处理中发送 `subscription_completed`
- 需从 metadata/session 中提取 plan、value、currency

**PayPal Webhook** (`src/app/api/paypal/webhook/route.ts`)
- 在订阅激活成功处理中发送 `subscription_completed`
- 需从订阅详情中提取对应字段

### 5.3 订阅取消

**Stripe/PayPal 取消** (`src/app/api/account/subscription/cancel/route.ts`)
- 发送 `subscription_cancelled`

---

## T6: 自定义维度后端支持

**目标**：确保 users 表可以存储和提供埋点所需的用户属性。

**需确认/可能需要的字段**（检查现有 `users` 表 Schema）：

| 字段 | 类型 | 用途 | 状态 |
|------|------|------|------|
| `id` | UUID | User-ID | 已存在 |
| `email` | string | 标识 | 已存在 |
| `subscription_status` | enum | 判断 user_type | 需确认 |
| `preferred_language` | string | 自定义维度 | 需确认 |
| `signup_source` | string | 自定义维度 | 需新增 |
| `first_referral_domain` | string | 自定义维度 | 需新增 |
| `created_at` | timestamp | signup_date | 已存在 |
| `last_active_at` | timestamp | last_active_date | 需确认 |

**行动**：
1. 检查 Supabase `users` 表当前 Schema
2. 若字段不存在，创建 migration 或直接通过 Supabase Dashboard 添加
3. 在 `AuthContext.tsx` 中更新 `last_active_at` 逻辑（登录时触发）

---

## T7: 本地测试与验证

**测试清单**：

1. **开发环境验证**：
   - 运行 `npm run dev`，打开 `http://localhost:3000`
   - 打开浏览器 DevTools Console，确认 `[Analytics]` 前缀日志出现
   - 执行注册→登录→上传产品→检测流程，检查每个事件参数是否正确

2. **GA4 DebugView 验证**：
   - 访问 GA4 后台 > 配置 > DebugView
   - 确认事件实时出现
   - 确认自定义维度随事件上报

3. **Edge Runtime 服务端事件测试**：
   - 本地调用 `api/check` 接口，检查 DebugView 中是否出现 `analysis_complete`
   - 可能需要使用 Stripe/PayPal 测试 webhook 验证 `subscription_completed`

4. **生产部署前检查**：
   - 确认新增的 `GA_API_SECRET` 环境变量已配置到 Cloudflare Pages 的 Environment Variables
   - 确认不会暴露客户端秘钥（`GA_API_SECRET` 不应以 `NEXT_PUBLIC_` 为前缀）

---

## 环境变量清单

| 变量名 | 作用 | 前缀要求 | 配置位置 |
|--------|------|----------|----------|
| `NEXT_PUBLIC_GA_ID` | GA4 数据流 ID | 必须是 `NEXT_PUBLIC_` | Cloudflare Pages + 本地 `.env` |
| `GA_API_SECRET` | Measurement Protocol API Secret | 不能是 `NEXT_PUBLIC_` | 仅 Cloudflare Pages Secret |
| `NEXT_PUBLIC_CLARITY_ID` | Clarity 项目 ID | 必须是 `NEXT_PUBLIC_` | 已存在 |

---

## 附录：快速参考—事件对应组件/接口映射

| 事件名 | 触发位置 | 实现方式 | 优先级 |
|---------|----------|----------|--------|
| sign_up | `AuthContext.tsx` signUp() | 客户端 | P0 |
| login | `AuthContext.tsx` signIn() | 客户端 | P0 |
| product_upload | 产品上传组件 | 客户端 | P0 |
| analysis_start | 检测发起组件 | 客户端 | P0 |
| analysis_complete | `api/check/route.ts` | 服务端 MP | P0 |
| report_view | 结果展示页面 | 客户端 | P0 |
| report_export | 导出按钮 | 客户端 | P0 |
| subscription_initiated | 订阅按钮 | 客户端 | P0 |
| subscription_completed | Stripe/PayPal Webhook | 服务端 MP | P0 |
| subscription_cancelled | 取消接口 + Webhook | 混合 | P1 |
| checkout_abandoned | `/pricing` 页面卸载 | 客户端 | P1 |
| feature_used | 各功能入口 | 客户端 | P1 |
| help_doc_viewed | 帮助文档链接 | 客户端 | P2 |
| support_ticket_created | 工单提交表单 | 客户端 | P2 |
