# M1b 邮件自动化 部署指南

> 本文档记录 M1b 邮件自动化的代码变更、环境变量配置与部署步骤。

---

## 一、代码变更清单

| 文件 | 动作 | 说明 |
|-------|------|------|
| `package.json` | 修改 | 新增 `resend` 依赖 |
| `src/lib/email.ts` | 新增 | Resend API 封装（Edge Runtime 兼容） |
| `src/lib/email-templates.ts` | 新增 | 邮件模板系统（Onboarding / 弃付召回 / 配额预警，支持 PT/ES/EN） |
| `src/app/api/email/onboarding/route.ts` | 新增 | Onboarding 欢迎邮件 API |
| `src/app/api/email/quota-warning/route.ts` | 新增 | 免费配额预警邮件 API |
| `src/app/api/email/abandoned-checkout/route.ts` | 新增 | 弃付召回邮件 API + 弃付事件记录 |
| `src/app/api/email/cron/abandoned-checkout/route.ts` | 新增 | 弃付召回批量处理 Cron API |
| `src/contexts/AuthContext.tsx` | 修改 | 注册后触发欢迎邮件 + 存储用户 email 到 sessionStorage |
| `src/app/[locale]/pricing/PricingContent.tsx` | 修改 | 离开定价页时记录弃付事件 |
| `src/sections/HeroSection.tsx` | 修改 | 检测完成后触发配额预警邮件 |
| `supabase/migrations/20250528_email_logs.sql` | 新增 | `email_logs` + `abandoned_checkouts` 表 |

---

## 二、环境变量配置

### Cloudflare Pages 环境变量

| 变量名 | 必填 | 值示例 | 说明 |
|--------|------|--------|------|
| `RESEND_API_KEY` | ✅ | `re_xxxxxxxxxx` | Resend API Key，仅服务端使用 |
| `FROM_EMAIL` | ❌ | `mail@cosmetcheck.com` | 发件邮箱，未配置时默认使用 Resend 共享域名 |
| `CRON_SECRET` | ❌ | `cron_xxxxxxxxxx` | Cron API 认证密钥，用于保护弃付召回批量处理接口 |

### 获取 Resend API Key

1. 访问 [resend.com](https://resend.com) 注册并登录
2. 进入 Settings → API Keys → Create API Key
3. 复制 Key（以 `re_` 开头）
4. 粘贴到 Cloudflare Pages Environment Variables

### 发件域名配置（可选）

- 未配置 `FROM_EMAIL`时，使用 Resend 共享域名 `onboarding@resend.dev`
- 生产环境建议使用自己的域名，如 `mail@cosmetcheck.com`
- 在 Resend 后台进行域名验证（Domain → Add Domain）

---

## 三、数据库迁移

在 Supabase Dashboard 的 SQL Editor 中执行 `supabase/migrations/20250528_email_logs.sql`，创建以下两张表：

### `email_logs` 表
用于记录邮件发送日志，防止重复发送。

### `abandoned_checkouts` 表
用于跟踪弃付结算事件，支持分步骤发送召回邮件。

---

## 四、邮件流设计

### Onboarding 欢迎流（3 封）
| 邮件 | 触发时机 | 触发来源 |
|------|----------|----------|
| #1 欢迎 | 注册完成后立即 | `AuthContext.signUp()` 内调用 `/api/email/onboarding` |
| #2 入门指南 | +24h | 需要定时任务或手动触发 |
| #3 案例展示 | +72h | 需要定时任务或手动触发 |

### 弃付召回流（3 封）
| 邮件 | 触发时机 | 触发来源 |
|------|----------|----------|
| #1 提醒 | +1h | Cron 调用 `/api/email/cron/abandoned-checkout` |
| #2 激励 | +24h | Cron 同上 |
| #3 最后机会 | +72h | Cron 同上 |

### 免费配额预警（2 封）
| 触发条件 | 触发来源 |
|----------|----------|
| 使用量达 80% | `HeroSection.handleCheck()` 内调用 `/api/email/quota-warning` |
| 使用量达 100% | 同上 |

---

## 五、Cron 配置

### 方案 A：Cloudflare Cron Triggers（推荐）

在 `wrangler.toml` 中添加：

```toml
[[triggers]]
crons = ["0 * * * *"]  # 每小时执行一次
```

或通过 Cloudflare Dashboard 配置：
- Workers & Pages → 你的项目 → Settings → Triggers → Cron Triggers
- 添加 `0 * * * *` 指向 `https://cosmetcheck.com/api/email/cron/abandoned-checkout?secret=CRON_SECRET`

### 方案 B：GitHub Actions

在 `.github/workflows/cron.yml` 中添加：

```yaml
name: Abandoned Checkout Recovery
on:
  schedule:
    - cron: '0 * * * *'  # 每小时
jobs:
  recover:
    runs-on: ubuntu-latest
    steps:
      - run: curl "https://cosmetcheck.com/api/email/cron/abandoned-checkout?secret=${{ secrets.CRON_SECRET }}"
```

---

## 六、测试检查清单

### 邮件发送测试
1. 注册新账号，确认收到 Onboarding 欢迎邮件
2. 登录后进行 8 次检测，确认收到 80% 配额预警邮件
3. 用完 10 次检测，确认收到 100% 配额预警邮件
4. 进入定价页后离开不购买，确认 `abandoned_checkouts` 表有记录

### Cron 测试
```bash
curl "https://cosmetcheck.com/api/email/cron/abandoned-checkout?secret=YOUR_CRON_SECRET"
```

预期返回：
```json
{
  "success": true,
  "processed": 5,
  "results": { "sent": 2, "skipped": 2, "errors": 0 }
}
```

---

## 七、风险与限制

| 项目 | 说明 |
|------|------|
| Resend 免费额度 | 3,000 封/月，超出后 $0.0001/封 |
| 重复发送防护 | 同一模板 24h 内只发一次（配额预警为当月只发一次） |
| 弃付召回 | 需要配置 Cron 才能自动触发，否则只记录不发送 |
| Edge Runtime | 所有邮件发送使用 fetch 直调 Resend API，无 Node.js 依赖 |
