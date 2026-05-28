# CosmetCheck 网站说明书（供运营 Agent 使用）

> 版本：2025-05-27  
> 用途：让运营 Agent 在产出《运营执行计划书》前，对网站现状有完整认知  
> 阅读对象：@Hermes_yunyin_bot（运营 Agent）

---

## 一、项目定位

**CosmetCheck** 是一个面向 **拉美市场（LatAm）美妆卖家** 的 AI 合规检测 SaaS。

- **核心价值**：一键检测产品是否符合巴西 ANVISA / 墨西哥 COFEPRIS 等拉美国家法规，AI 自动生成高转化 Listing
- **目标用户**：跨境电商平台卖家（Amazon、Shopee、Mercado Libre 等），主营美妆/护肤/个护类目
- **目标市场**：巴西、墨西哥、哥伦比亚、阿根廷、智利（当前 MVP 支持 BR/MX）
- **语言支持**：英语（默认）、中文、巴西葡萄牙语（pt-BR）、墨西哥西班牙语（es-MX）
- **部署状态**：已部署至 Cloudflare Pages，域名 `https://cosmetcheck.pages.dev`

---

## 二、技术栈与架构

| 层级 | 技术 |
|------|------|
| 前端 | Next.js 15 (App Router) + TypeScript + Tailwind CSS + shadcn/ui |
| 运行时 | Cloudflare Pages Edge Runtime（`runtime = 'edge'`） |
| 后端 | Next.js API Routes（无独立后端服务） |
| 数据库 | Supabase（PostgreSQL + Auth） |
| 支付 | Stripe + PayPal（双通道） |
| AI | DeepSeek v4 Flash（主）/ OpenAI gpt-4o-mini（备） |
| 分析 | Google Analytics 4 + Microsoft Clarity（已集成，需环境变量启用） |
| 邮箱 | 已预留 Resend 接入点，暂未启用邮件自动化 |

---

## 三、网站页面结构

### 已上线页面（多语言路由 `/[locale]/...`）

| 页面 | 路径 | 说明 |
|------|------|------|
| 首页 | `/[locale]/` | 核心转化页，含 Hero、检测表单、交互 Demo、定价、FAQ |
| 定价页 | `/[locale]/pricing` | Free vs Pro 对比、月付/年付切换、Stripe/PayPal 订阅入口 |
| 批量检测 | `/[locale]/batch` | Pro Annual 专属，CSV 批量上传检测 |
| 账户页 | `/[locale]/account` | 用户订阅管理、账户删除 |
| FAQ | `/[locale]/faq` | 多语言 FAQ |
| 关于 | `/[locale]/about` | 团队/品牌介绍 |
| 联系 | `/[locale]/contact` | 联系表单 |
| 法律页 | `/[locale]/privacy`, `/terms`, `/refund`, `/disclaimer`, `/cookie-policy` | 合规法律页面 |

### 非多语言快捷入口（SEO Landing Page）
- `/brasil` — 巴西 ANVISA 专项页面
- `/mexico` — 墨西哥 COFEPRIS 专项页面

### 核心组件
- **Navbar**：固定导航，含语言切换器、登录/注册按钮（AuthModal）、用户菜单
- **InteractiveDemo**：首页交互式 Demo，展示检测→发现违规→修复→生成 Listing 的动画流程
- **ChatWidget**：右下角悬浮 AI 客服（Support 模式）/ AI 顾问（Advisor 模式，Pro 专属）
- **CookieConsent**：Cookie 同意弹窗
- **AuthModal**：邮箱+密码登录/注册弹窗（Supabase Auth）

---

## 四、核心功能与用户旅程

### 4.1 合规检测流程（免费核心功能）

```
用户输入（成分/描述/标签）
  → 选择目标国家（BR/MX）
  → 点击"Check Now"
  → API /api/check（Edge Runtime）
    → 配额检查（IP 级别，10次/30天）
    → 规则引擎（engine.ts）匹配 ANVISA/COFEPRIS 规则
    → 返回：违规项（critical/warning/info）+ 建议修改
  → 结果页展示
```

**关键规则**：
- 免费用户无需注册即可检测，以 IP 为标识（`x-forwarded-for`）
- 免费额度：10 次/30 天/identifier
- 超过配额后返回 429，提示升级 Pro
- 配额存储在 Supabase `user_quotas` 表

### 4.2 AI Listing 生成流程（Pro 专属）

```
用户输入产品名 + 成分 + 功效 + 品类 + 目标国家
  → 点击"Generate"
  → API /api/generate（Edge Runtime）
    → 检查登录状态（x-user-email header）
    → 检查订阅等级（subscription.ts：Pro 才能使用）
    → 检查配额 + 速率限制（10 req/min token bucket）
    → AI 生成 Listing（标题/描述/Bullet Points/成分表/合规注释）
    → 输出 moderation（安全兜底）
  → 展示生成结果，支持复制
```

### 4.3 批量检测流程（Pro Annual 专属）

```
上传 CSV / 粘贴文本
  → API /api/batch/detect
    → 检查订阅等级（仅 pro-annual / team）
    → 异步处理，任务存储在 batch_tasks / batch_results 表
    → 支持导出 Excel
```

### 4.4 订阅体系

| 等级 | 价格（USD） | 检测额度 | Listing 生成 | 批量检测 | AI 客服 |
|------|------------|----------|-------------|----------|---------|
| Free | $0 | 10次/30天 | ❌ | ❌ | ❌ |
| Pro Monthly | ~$29/月 | 无限 | 无限 | ❌（提示升年付） | Support |
| Pro Annual | ~$199/年 | 无限 | 无限 | ✅ | Support + Advisor |
| Team | 待定 | 无限 | 无限 | ✅ | 全部 |

> 注：当前订阅检查为白名单硬编码（`subscription.ts`），Stripe/PayPal webhook 已接入但未完全打通真实订阅状态查询。

---

## 五、数据与埋点现状

### 5.1 当前已接入
- **GA4**：基础页面浏览（需 `NEXT_PUBLIC_GA_ID` 环境变量）
- **Microsoft Clarity**：热力图、录屏（需 `NEXT_PUBLIC_CLARITY_ID`）
- **Supabase 表**：
  - `user_quotas`：IP 级别免费配额消耗
  - `rate_limits`：API 速率限制令牌桶
  - `subscribers`：邮箱订阅列表（Footer CTA）
  - `batch_tasks` / `batch_results`：批量任务
  - `users`（Supabase Auth 自带）：用户基础信息

### 5.2 缺失的运营数据（运营计划需补齐）
- ❌ 转化漏斗事件（首页→检测→结果页→注册→付费）
- ❌ 检测功能使用频次、平均输入长度、国家选择分布
- ❌ 付费转化归因（哪个页面/入口带来的订阅）
- ❌ 用户留存（免费额度消耗曲线、7日/30日回访）
- ❌ A/B 测试框架
- ❌ 邮件自动化（drip campaign、额度提醒、弃付召回）

---

## 六、SEO 现状

### 6.1 已做
- 多语言路由（`/en`, `/zh`, `/pt-BR`, `/es-MX`）
- Schema.org 结构化数据（WebApplication、FAQPage、Offer、AggregateRating）
- 静态 sitemap.ts + robots.ts
- 暗黑主题、SSL、响应式

### 6.2 待做（运营可推进）
- 每个国家/法规的独立 SEO Landing Page（如 `/compliance/brazil-anvisa`）
- 博客内容（监管更新、合规指南、案例研究）
- 外链建设（美妆行业目录、跨境卖家社区）
- 多语言关键词优化（PT/ES 关键词研究）

---

## 七、当前已知问题与限制

1. **订阅状态查询不完善**：`subscription.ts` 目前使用硬编码白名单，未完全对接 Stripe/PayPal 实时状态
2. **防薅羊毛机制初级**：仅靠 IP 配额，无设备指纹、无验证码（Turnstile 预留但未启用）
3. **邮件系统未启用**：无用户 onboarding 邮件、无弃付召回
4. **客服系统无人工兜底**：ChatWidget 纯 AI，无人工转接机制
5. **分析数据不足**：缺少业务级事件埋点，无法计算真实 LTV/CAC
6. **退款/争议处理**：有 dispute API 和表单，但未接入自动化工作流

---

## 八、运营 Agent 产出要求

基于以上信息，请产出 **《CosmetCheck 运营执行计划书》**，包含：

1. **里程碑规划**（M1 数据基建 → M2 内容/SEO → M3 增长实验 → M4 规模化）
2. **内容日历**（前 8 周博客/社交媒体选题）
3. **KPI 看板**（按阶段定义北极星指标、过程指标、健康指标）
4. **用户激活策略**（免费→付费的转化优化方案）
5. **渠道优先级排序**（SEO、社区、付费广告、KOL 等）
6. **数据埋点需求清单**（需要研发配合补充的事件）

交付格式：Markdown 文档，可直接呈报 CTO 审批。
