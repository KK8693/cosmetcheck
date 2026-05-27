# ADR-001: GA4 事件埋点架构（M1a 测量基建）

> **状态**：草案，待 CTO 审批
> **日期**：2026-05-27
> **作者**：首席架构师
> **相关**：运营计划书 v1.1 第八节、第十三节 13.1

---

## 1. 背景

运营计划 M1a 要求在 Week 1-4 完成 GA4 + Clarity 的测量基建。现有状态：
- ✅ GA4 基础脚本已部署（`src/components/Analytics.tsx`）
- ❌ 无结构化事件追踪（仅页面加载）
- ❌ 无用户属性同步
- ❌ 无自定义维度传递

---

## 2. 决策项与选型对比

### 2.1 GA4 SDK 集成方式

| 维度 | A. 原生 gtag（演进） | B. @next/third-parties/google | C. react-ga4 |
|------|----------------------|-------------------------------|--------------|
| **Next.js 15 兼容性** | ✅ 完全兼容 | ✅ 官方维护 | ⚠️ 社区包，更新滞后 |
| **类型安全** | ❌ 需自建 `.d.ts` | ✅ 内置 TypeScript | ✅ 有类型定义 |
| **加载优化** | 手动配置 | 自动预连接 + Partytown 支持 | 无优化 |
| **引入成本** | 0 新依赖 | +1 依赖 | +1 依赖 |
| **改造成本** | 低（现有基础上扩展） | 中（需重构 Analytics.tsx） | 低 |
| **Edge Runtime 兼容** | ✅ 纯前端，无关 | ✅ 纯前端 | ✅ 纯前端 |

**决策：A（原生 gtag 演进）**
- **理由**：M1a 时间窗口紧（W1-W2），现有 `Analytics.tsx` 已使用 gtag，推倒重来风险高。通过自建 `lib/analytics.ts` 封装层补齐类型安全即可。
- **未来升级路径**：M3 若引入 PostHog 或需要 Partytown，再评估迁移至 `@next/third-parties/google`。

### 2.2 客户端事件 vs 服务端事件（Measurement Protocol）

| 事件类型 | 推荐渠道 | 原因 |
|----------|----------|------|
| 用户交互（点击、浏览） | 客户端 gtag | 需要 DOM 上下文 |
| 后端业务完成（检测完成、支付成功） | 服务端 Measurement Protocol | 用户可能在请求完成前关闭浏览器，客户端事件易丢失 |
| 支付状态变更 | 服务端（Webhook） | Stripe/PayPal 回调是可信源 |

**决策：混合模式（Hybrid）**
- 前端： sign_up, login, product_upload, analysis_start, report_view, report_export, subscription_initiated, checkout_abandoned
- 后端： analysis_complete, subscription_completed, subscription_cancelled

### 2.3 用户身份关联方案

GA4 User-ID 功能要求：
1. 在 GA4 后台开启 User-ID 功能（运营负责 W1）
2. 前端通过 `gtag('config', GA_ID, { user_id: '...' })` 设置
3. Supabase `user.id`（UUID）直接作为 User-ID

**匿名用户处理**：未登录用户使用 `anonymous_<session_id>` 格式，通过 `sessionStorage` 保持会话一致性。注册后将匿名事件链通过 `user_id` 关联。

---

## 3. 架构设计

### 3.1 数据流

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   React Client  │────▶│   gtag.js       │────▶│   GA4 Server    │
│   (lib/analytics)│     │   (browser)     │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │
         │ 用户交互事件
         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Next.js Edge   │────▶│  Measurement    │────▶│   GA4 Server    │
│  API Route      │     │  Protocol (fetch)│     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │
         │ 后端业务事件（analysis_complete, subscription_*）
```

### 3.2 模块结构

```
src/
├── lib/
│   ├── analytics.ts          # 核心封装层（类型定义 + gtag 工具函数）
│   ├── analytics-server.ts   # Edge Runtime 可用的 Measurement Protocol 发送器
│   └── analytics-types.ts    # 事件名、参数、维度的 TypeScript 类型
├── components/
│   └── Analytics.tsx         # 现有文件扩展：用户属性同步 + User-ID
└── hooks/
    └── useAnalytics.ts       # React Hook：便捷的事件发送 + 页面生命周期追踪
```

### 3.3 关键设计决策

**D1: Signup Source 捕获**
- 首次访问时读取 `document.referrer`，持久化到 `localStorage`（key: `cc_first_referrer`）
- 注册时连同 `signup_source`（解析后的分类：organic / referral / direct / social）一并写入用户表
- 后续所有事件通过自定义维度 `signup_source` 和 `first_referral_domain` 携带

**D2: User Type 判定**
- `free`: 未订阅用户（包括匿名和登录但未付费）
- `trial`: 未来预留（当前无 trial 机制）
- `paid`: 存在有效订阅（通过 Stripe/PayPal webhook 更新 users 表 `subscription_status`）

**D3: 免费额度预警事件接口（为 M1b 预留）**
- `lib/analytics.ts` 中暴露 `trackQuotaWarning(percent: 80 | 100)` 函数
- M1b 邮件自动化开发时直接调用，无需重复设计

**D4: 调试模式**
- 开发环境（`NODE_ENV === 'development'`）下，`window.__analytics_debug = true` 时控制台打印所有事件
- 增加 `debug_mode: true` event parameter 发送到 GA4 DebugView（运营验证用）

---

## 4. 关键配置参数

| 配置项 | 值 | 说明 |
|--------|-----|------|
| GA4 数据流 ID | `NEXT_PUBLIC_GA_ID` | 已存在 |
| Measurement Protocol API Secret | `GA_API_SECRET` | 新增服务端环境变量，在 GA4 > 数据流 > Measurement Protocol 中生成 |
| GA4 衡量 ID | `G-XXXXXXXXXX` | 格式验证 |
| 数据保留期 | 14 个月 | 运营在 GA4 后台设置 |
| IP 匿名化 | `anonymize_ip: true` | LGPD 合规，显式配置 |

---

## 5. 风险评估

| 风险 | 等级 | 缓解措施 |
|------|------|----------|
| Edge Runtime 下 Measurement Protocol fetch 被 Cloudflare 限制 | P1 | 使用 `fetch` 直接发送至 `https://www.google-analytics.com/mp/collect`，无第三方库依赖；预发环境验证 |
| GA4 User-ID 后台未开启导致关联失败 | P1 | 运营 W1 必须完成 GA4 User-ID 配置，作为 M1a 验收标准之一 |
| SPA 路由切换时页面浏览事件丢失 | P1 | Next.js App Router 的 `usePathname()` 监听路由变化，手动发送 `page_view` |
| Signup referrer 在重定向后丢失 | P2 | 在 RootLayout 首次挂载时捕获并写入 localStorage，早于任何重定向 |
| 匿名用户 → 登录用户事件断链 | P2 | 登录成功后立即重新 `gtag('config')` 绑定 user_id，GA4 会自动做会话级关联 |

---

## 6. 验收标准

1. P0 事件（8个）在 GA4 DebugView / 实时报告中可见
2. 自定义维度（user_type, preferred_language, signup_source）随事件正确上报
3. 用户属性（user_id, subscription_plan）在 GA4 受众报告中可筛选
4. 服务端事件（analysis_complete, subscription_completed）不依赖用户浏览器状态即可到达 GA4
5. 所有新增代码通过 TypeScript 类型检查，无 `any`

---

## 7. 相关任务文档

- [研发任务清单：M1a Tracking Implementation](../tasks/M1a-tracking-implementation.md)
