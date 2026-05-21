# Cloudflare Pages 环境变量配置清单

**生成时间:** 2026-05-21
**用途:** 对比本地 `.env.local` 与 Cloudflare Pages 生产环境应配置的环境变量
**配置路径:** Cloudflare Dashboard → Pages → cosmetcheck → Settings → Environment variables

---

## 本地 `.env.local` 已配置的变量

| 变量名 | 本地值 | 生产环境必须配置 | 说明 |
|--------|---------|-------------|------|
| `PAYPAL_ENVIRONMENT` | `sandbox` | ⚠️ 建议修改 | 测试环境用 `sandbox`，生产环境必须改为 `live` |
| `PAYPAL_CLIENT_ID` | `AUUpM7...` | ✅ 必须 | PayPal 应用程序客户端 ID |
| `PAYPAL_CLIENT_SECRET` | `EDTX7z...` | ✅ 必须 | PayPal 应用程序密钥 |
| `PAYPAL_PRO_MONTHLY_PLAN_ID` | `P-1BS7...` | ✅ 必须 | PayPal Pro 月度订阅计划 ID |
| `NEXT_PUBLIC_PAYPAL_PRO_MONTHLY_PLAN_ID` | `P-1BS7...` | ✅ 必须 | 前端展示用的 PayPal 计划 ID |
| `DEEPSEEK_API_KEY` | `sk-...` | ✅ 必须 | DeepSeek AI API 密钥（Listing 生成主要供应商） |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://ynrawz...` | ✅ 必须 | Supabase 项目 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable...` | ✅ 必须 | Supabase 匿名公钥（前端使用） |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | ⚠️ 建议修改 | 本地开发用，生产环境应为 `https://cosmetcheck.pages.dev` |

---

## 本地 `.env.local` 缺失、生产环境必须补上的变量

| 变量名 | 是否必须 | 缺失风险 | 说明 |
|--------|---------|---------|------|
| `SUPABASE_SERVICE_ROLE_KEY` | 🔴 **P0 必须** | 配额/限流完全失效 | 服务端读写 `user_quotas` / `rate_limits` / `listings` 表必需。缺失后所有用户配额不受限制，可被无限刷。 |
| `OPENAI_API_KEY` | 🟡 **P1 强烈建议** | AI 生成无 fallback | DeepSeek 故障/限流时自动切换到 OpenAI。本地未配置，生产环境建议配置。 |
| `QUOTA_WHITELIST` | 🟢 **P2 功能需求** | 白名单不生效 | 你提出的需求。格式：`lifaqiang06@gmail.com` 或多个邮箱用逗号分隔。 |
| `STRIPE_SECRET_KEY` | 🔴 **P0 必须** | Stripe 支付完全不可用 | 支付流程依赖此 key。本地未配置，生产环境必须有。 |
| `STRIPE_WEBHOOK_SECRET` | 🔴 **P0 必须** | Webhook 验证失败 | Stripe webhook 端点验证签名必需。 |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | 🔴 **P0 必须** | Stripe Checkout 不可用 | 前端 Stripe.js 初始化必需。 |
| `NEXT_PUBLIC_BASE_URL` | 🟢 **P2 建议** | SEO 元数据不正确 | robots.ts / sitemap.ts 使用，默认 `https://cosmetcheck.com`。建议设为 `https://cosmetcheck.pages.dev` 或自定义域名。 |

---

## 本地 `.env.local` 与 `.env.example` 对比差异

| 变量名 | `.env.local` | `.env.example` | 结论 |
|--------|-------------|---------------|--------|
| `DEEPSEEK_API_KEY` | ✅ 有 | ❌ 无 | `.env.example` 漏了 DeepSeek，应补充 |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ 无 | ✅ 有 | 本地开发必须补充，否则配额失效 |
| `OPENAI_API_KEY` | ❌ 无 | ✅ 有 | 建议补充作为 fallback |
| `QUOTA_WHITELIST` | ❌ 无 | ❌ 无 | 新增功能，两者都没有 |
| Stripe 所有变量 | ❌ 无 | ✅ 有 | 本地未配置 Stripe，仅支付相关 |
| `NEXT_PUBLIC_APP_URL` | `localhost` | `localhost` | 生产环境需要覆盖为真实域名 |

---

## 生产环境完整配置模板

```bash
# === AI 生成 ===
DEEPSEEK_API_KEY=sk-...
OPENAI_API_KEY=sk-...

# === Supabase ===
NEXT_PUBLIC_SUPABASE_URL=https://ynrawzmimeilahoknpvg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_Nzm6vZ1NglsRgduAvAvzlA_Twz1od8W
SUPABASE_SERVICE_ROLE_KEY=<your_service_role_key>

# === Stripe 支付 ===
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_MONTHLY_PRICE_ID=price_...
STRIPE_PRO_YEARLY_PRICE_ID=price_...
STRIPE_TEAM_MONTHLY_PRICE_ID=price_...

# === PayPal 支付 ===
PAYPAL_ENVIRONMENT=live
PAYPAL_CLIENT_ID=<live_client_id>
PAYPAL_CLIENT_SECRET=<live_client_secret>
PAYPAL_WEBHOOK_ID=<live_webhook_id>
PAYPAL_PRO_MONTHLY_PLAN_ID=P-...
NEXT_PUBLIC_PAYPAL_PRO_MONTHLY_PLAN_ID=P-...
PAYPAL_PRO_MONTHLY_USD_PLAN_ID=P-...
PAYPAL_PRO_YEARLY_USD_PLAN_ID=P-...
PAYPAL_PRO_MONTHLY_BRL_PLAN_ID=P-...
PAYPAL_PRO_YEARLY_BRL_PLAN_ID=P-...
PAYPAL_PRO_MONTHLY_MXN_PLAN_ID=P-...
PAYPAL_PRO_YEARLY_MXN_PLAN_ID=P-...

# === 应用 URL ===
NEXT_PUBLIC_APP_URL=https://cosmetcheck.pages.dev
NEXT_PUBLIC_BASE_URL=https://cosmetcheck.pages.dev

# === 配额白名单 ===
QUOTA_WHITELIST=lifaqiang06@gmail.com
```

---

## 紧急行动项

1. 🔴 立即检查 Cloudflare Pages 上 `DEEPSEEK_API_KEY` 是否已配置且值与本地一致
2. 🔴 立即检查 Cloudflare Pages 上 `SUPABASE_SERVICE_ROLE_KEY` 是否已配置
3. 🟡 建议配置 `OPENAI_API_KEY` 作为 fallback
4. 🟢 根据需求配置 `QUOTA_WHITELIST`

---

*文件路径:* `docs/cloudflare-env-checklist.md`
