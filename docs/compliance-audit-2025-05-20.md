# CosmetCheck 合规审查报告

> 生成时间：2025-05-20
> 审查依据：student-site-compliance-pipeline Skill + 代码库实际低层审计

---

## 1. 风险等级判断

🟡 **中风险**

原因：
- 有用户注册/登录（Supabase Auth）
- 上传产品信息/成分（可视为上传文件的一种）
- AI 生成内容（标题、描述、弹屏点、法规检测报告）
- 有支付/订阅（Stripe + PayPal）
- 处理用户个人数据（邮箱、IP、产品信息）

（四个触发条件触发了三个：注册、AI、支付，不得按纯工具站处理）

---

## 2. 数据流摘要

```
用户输入
  → 产品名、成分列表、功效声称、目标市场（BR/MX）
  → 前端（Next.js + next-intl）
    → 合规检测 API (/api/check)
      → 本地法规数据库（src/data/regulations/...）
      → 检测结果（是否含禁用成分、违规声称、包装标签规范）
    → AI 生成 API (/api/generate)
      → DeepSeek/OpenAI API
      → Moderation API（输入过滤 + 输出检查）
    → 批量检测 API (/api/batch/detect)
      → 同理用本地法规数据库
  → 存储
    → Supabase（用户认证、合规检测记录、生成记录）
    → 作业每次请求会派发新的 Edge Runtime 实例（无法保留 in-memory 状态）
  → 支付
    → Stripe（订阅管理）
    → PayPal（订阅管理）
  → 分析
    → Cloudflare（访问日志、安全）
  → 输出
    → 合规报告 + AI 生成的产品列表
  → 删除
    → /api/account/delete 接口（级联删除 Supabase Auth + 用户数据）
```

---

## 3. 第三方服务清单

| 服务 | 用途 | 处理的数据 | 接触用户内容 | 是否跨境传输 | 是否用于模型训练 | 政策链接 |
|---|---|---|---|---|---|---|
| Cloudflare Pages | 托管/加速/Edge | IP、访问日志、安全识别 | 否 | 是（全球 CDN） | 否 | [Privacy](https://www.cloudflare.com/privacypolicy/) |
| Supabase | Auth + 数据库 | 邮箱、用户认证、产品检测记录 | 是（产品信息） | 是 | 否 | [Privacy](https://supabase.com/privacy) |
| Stripe | 支付处理 | 支付卡信息（非完整卡号）、订单记录 | 否 | 是 | 否 | [Privacy](https://stripe.com/privacy) |
| PayPal | 支付处理 | 支付账户信息、订单记录 | 否 | 是 | 否 | [Privacy](https://www.paypal.com/us/legalhub/privacy) |
| OpenAI | AI 生成 | Prompt、AI 生成的文本内容 | 是 | 是 | 待确认 [Privacy](https://openai.com/policies/privacy-policy) |
| DeepSeek | AI 生成/内容审核 | Prompt、AI 生成的文本内容 | 是 | 是 | 待确认 [Privacy](https://www.deepseek.com/privacy) |

---

## 4. 必需合规页面

| 页面 | 状态 | 路径 | 说明 |
|---|---|---|---|
| Privacy Policy | ✅ 存在 | `/[locale]/privacy` | i18n化，但 zh/pt-BR/es-MX 未翻译 |
| Terms of Service | ✅ 存在 | `/[locale]/terms` | i18n化，但 zh/pt-BR/es-MX 未翻译 |
| Cookie Policy | ✅ 存在 | `/[locale]/cookie-policy` | i18n化，但 zh/pt-BR/es-MX 未翻译 |
| Refund Policy | ✅ 存在 | `/[locale]/refund` | i18n化，但 zh/pt-BR/es-MX 未翻译 |
| Disclaimer | ✅ 存在 | `/[locale]/disclaimer` | i18n化，但 zh/pt-BR/es-MX 未翻译 |
| Contact | ⚠️ 非单独页面 | 通过 WhatsApp和邮箱支持 | 推荐增加 `/contact` 页面简要联系方式 |
| FAQ | ✅ 存在 | `/[locale]/faq` | 用作帮助/支持 |

---

## 5. 数据处理表

| 数据类型 | 用途 | Lawful Basis | 第三方 | 保留期限 | 用户可否删除 |
|---|---|---|---|---|---|
| 邮箱地址 | 注册、登录、订阅通知 | Contract | Supabase (Auth) | 账户存在期间，注销后依法保留 | ✅ 可通过 /api/account/delete |
| 产品信息/成分列表 | 提供合规检测、AI 生成服务 | Contract | Supabase、OpenAI/DeepSeek | [FIXME: 未明确说明] | ✅ 通过账户删除 |
| AI 生成内容 | 展示给用户 | Contract | Supabase | [FIXME: 未明确说明] | ✅ 通过账户删除 |
| IP / 访问日志 | 安全、防滥用、排错 | Legitimate Interests | Cloudflare | 30–180 天（按 Cloudflare 配置） | 可依法申请；安全留存期可能保留 |
| 分析数据 | 统计访问、优化页面 | Consent / Legitimate Interests | 待确认是否使用 GA/Clarity 等 | 按工具配置 | 通过 Cookie Banner 设置或浏览器设置退出 |
| Cookie 同意状态 | 记录用户偏好 | Legitimate Interests | 本地 localStorage | 直到用户清除或更新同意 | ✅ 通过浏览器清除 localStorage |
| 支付/订单记录 | 订单管理、开票、退款 | Contract / Legal Obligation | Stripe / PayPal | 支付服务商处理；本站保存必要订单记录 | 可请求删除；交易记录可能依法保留 |

⚠️ **待确认：**
- [ ] 产品信息和 AI 生成内容的保留期限未在文档中明确（仅写了 "as long as necessary"）
- [ ] 是否使用 Google Analytics / Clarity / 其他分析工具
- [ ] 分析工具的 Cookie 是否受 Cookie Banner 控制

---

## 6. 支付/订阅合规检查

| 检查项 | 状态 | 说明 |
|---|---|---|
| 支付服务商 | ✅ Stripe + PayPal | 不自己处理完整卡号，符合要求 |
| 支付处理摘要 | ✅ 已在 en.json 中说明 | "We use Stripe to process payments..." 多处提到 |
| 自动续费揭露 | ✅ | Privacy/Terms 中已说明 |
| 退款窗口 | ✅ 7 天 | Refund Policy 中已明确，首次订阅 7 天全额退款 |
| 取消路径 | ⚠️ 已在文档中说明 | "Account Settings → Billing → Manage Subscription" 但产品中实际该功能可能未完全实现 |
| VAT / Sales Tax | [FIXME: 待确认] | 价格页面上的价格是否含税未明确 |
| 发票/税费 | 待确认 | FAQ 提到 "international invoices" 但需确认是否自动生成 |
| Chargeback 政策 | ✅ | 已明确说明先联系支持，不写"禁止 chargeback" |
| 定价方案 | ✅ Free + Pro | $29/月或 $245/年（年付省 $103） |
| Credits/点数 | ✅ 已说明不计算 | "不提供 Credits 或点数购买"，Free 层每月 10 次检测 |

🔴 **重要安全问题：**
- **Stripe Webhook 开发环境绕过** (line 35-38): `endpointSecret` 为空时，模式切换为 `JSON.parse(payload)` 验证不做签名校验。**正确做法：fail-close** — 当环境变量不存在时应返回 400，而不是绕过。
- **硬编码邮箱白名单控制付费等级** (src/lib/subscription.ts line 34-38): `PRO_WHITELIST` 中存有真实邮箱 `lifaqiang06@gmail.com`。这是明显的商业欺诈漏洞，必须移除。

---

## 7. AI 内容安全检查

| 检查项 | 状态 | 说明 |
|---|---|---|
| 输入过滤 | ✅ | moderateContent() 在 generate API 中调用，flagged 则拒绝（HTTP 400） |
| Prompt 安全约束 | ⚠️ | DeepSeek 使用系统 prompt 加载内容审核任务，但系统 prompt 本身就是一种约束 |
| 输出检查 | ✅ | AI 生成结果会过 Moderation API，flagged 时返回警告，但不强制阻止 |
| 人工复核状态 | ❌ 未实现 | 没有 `pending_safety_check → approved / rejected / manual_review` 状态机 |
| 深伪/人脸风险 | [FIXME: 待确认] | AI 生成的是文本内容（标题、描述、弹屏点），不是图片/视频，风险较低。但产品是美妆/护肤品，需确认不涉及医疗/健康声明 |

🟡 **注意：**
- **Moderation API 失败行为不一致** (src/lib/moderation.ts line 27-30 vs line 93): 
  - DeepSeek 没有 API key 时 → `flagged: true` (fail-close, ✅)
  - OpenAI API 报错时 → `flagged: false` (fail-open, 🔴) 
  - 应统一为 fail-close: API 失败时默认阻止内容，而不是放行。

---

## 8. 关键代码层审计发现

| 问题 | 严重性 | 位置 | 修复建议 |
|---|---|---|---|
| In-memory quota 在 serverless 环境中丢失 | 🔴 高 | src/lib/quota.ts | quotaStore 是 `new Map()`，Cloudflare Workers 每次请求可能新实例，配额会重置，用户可以无限刷新提升 Free 配额。**必须使用 Redis/DO/Supabase KV 持久化。** |
| In-memory rate limit 同样问题 | 🔴 高 | src/lib/rate-limit.ts | `buckets` 是 `new Map()`，同上。 |
| Stripe webhook fail-open | 🔴 高 | src/app/api/stripe/webhook/route.ts:35-38 | 缺少 endpointSecret 时应返回 400，而不是 `JSON.parse(payload)`。 |
| 硬编码邮箱白名单 | 🔴 高 | src/lib/subscription.ts:34-38 | PRO_WHITELIST 中存有真实邮箱，必须完全移除，从数据库/支付服务商获取等级。 |
| WhatsApp 没有电话号码 | 🟡 中 | WhatsAppFAB.tsx / FooterSection.tsx | `wa.me/?text=` 没有填写电话号码，用户打开的是空白的 WhatsApp，体验差。填写服务手机号。 |
| Moderation API 不一致的 fail-open | 🟡 中 | src/lib/moderation.ts:93 | OpenAI API 报错时放行内容，应改为阻止。 |
| Privacy 章节编号错误 | 🟡 中 | en.json legal.privacy | 第 5 章是 "Data Storage" 但之后又写了 "5. Your Rights"、"7. Data Retention"，章节号与标题号重叠混淆。建议整理为 s1-s8 有效顺序。 |
| Privacy Cookie 表格详情不完整 | 🟡 中 | en.json legal.privacy s2 | Cookie 表格中 "Marketing / Advertising" 和 "Analytics" 行的内容可能不够详细，建议列出每个 Cookie 的名称、作用、保留期。 |
| Cookie Banner 未显示类型选择 | 🟡 中 | CookieConsent.tsx | 只有 "Accept All" 和 "Decline All"，无法分类接受必要/5206析/营销 Cookie。对于欧盟/英国用户，这是不够的。 |
| Cookie Banner 不控制分析脚本 | 🟡 中 | 全站 | 需确认是否使用了 Google Analytics、Clarity 等第三方追踪，如果有，必须在用户同意前不加载。 |
| Team Tier 仍被引用 | 🟡 中 | en.json legal.terms s3 | Terms 中 "Team Plan" 已不存在（产品只有 Free/Pro），需移除相关描述。 |
| 多语言路由分收比例图 | 🟠 低 | src/middleware.ts | `/pt` 和 `/es` 有 localeAliases 但实际用户可能访问 `/es-MX`、`/pt-BR`，建议测试确认。 |

---

## 9. 上线前 Checklist

### 页面完整性
- [ ] `/privacy` ━ Privacy Policy（已存在，需翻译）
- [ ] `/terms` ━ Terms of Service（已存在，需翻译，需移除 Team Tier 引用）
- [ ] `/cookie-policy` ━ Cookie Policy（已存在，需翻译）
- [ ] `/refund` ━ Refund Policy（已存在，需翻译）
- [ ] `/disclaimer` ━ Disclaimer（已存在，需翻译）
- [ ] `/contact` ━ 联系方式（推荐增加单独页面）
- [ ] `/faq` ━ FAQ（已存在）

### 页面链接
- [x] Footer 导航包含 Privacy / Terms / Cookie / Refund / Disclaimer
- [x] Cookie Banner 链接到 Cookie Policy
- [ ] Checkout 页面显示支付协议/订阅提示
- [ ] 订阅确认邮件包含续费/取消提示

### 数据与第三方
- [x] 数据处理表已建立（本报告中）
- [ ] 数据保留期限需明确（产品信息、AI 生成内容）
- [ ] 确认不使用的第三方（GA/Clarity 等）

### Cookie
- [x] Cookie Banner 组件存在并在根布局中渲染
- [ ] 必要与非必要 Cookie 区分
- [ ] 如有 GA/Clarity，确保欧盟/英国用户同意前不加载
- [ ] Cookie Banner 支持分类同意（必要/分析/营销）

### 代码层安全
- [ ] **Stripe Webhook 改为 fail-close** — 缺少 endpointSecret 时返回 400
- [ ] **移除硬编码邮箱白名单** — 从数据库/支付服务商获取等级
- [ ] **Quota 持久化** — 使用 Redis/Supabase KV 代替 in-memory Map
- [ ] **Rate limit 持久化** — 同上
- [ ] **Moderation API fail-open 修复** — 统一为 fail-close

### 支付
- [ ] 确保订阅取消入口实际可用
- [ ] 确保退款申请流程可执行
- [ ] 确认实际订阅状态与白名单分离

### AI 内容安全
- [x] 输入过滤
- [x] Prompt 安全约束（系统 prompt）
- [x] 输出检查（弱）
- [ ] 输出检查强化（flagged 时阻止，而不是仅发警告）
- [ ] 人工复核状态（如需要）

### 品牌/IP
- [x] 未使用他人 logo/商标/官方暗示
- [x] 未使用 "official / approved by / guaranteed / best" 高风险表述
- [x] AI 生成文本，不涉及人脸/深伪/商标

### i18n 多语言
- [ ] zh.json legal 部分翻译（P0-1 任务）
- [ ] pt-BR.json legal 部分翻译（P0-1 任务）
- [ ] es-MX.json legal 部分翻译（P0-1 任务）

### 版本管理
- [x] 每个法律页面有 Last updated: May 12, 2025
- [ ] 内部保留 change log（推荐）
- [x] 联系邮箱: support@cosmetcheck.com

---

## 10. 与现有合规文件的差距分析

### 现有文件 vs 缺陷对比

| 现有合规文件 | 当前状态 | 与实际行为是否一致 | 缺陷/HTTP 429 |
|---|---|---|---|
| en.json - Privacy Policy | 完整，包含 8 个章节 | ✅ 基本一致 | 章节编号混乱（s5/第6章/第7章）＋Cookie 表格不完整 |
| en.json - Terms | 完整，包含 11 个章节 | ⚠️ Team Tier 仍被提及 | 需移除 Team 相关条款 |
| en.json - Cookie Policy | 完整，包含 6 个章节 | ⚠️ 与实际 Cookie 使用情况需确认 | 缺乏分类接受功能说明（仅接受/拒绝） |
| en.json - Refund | 完整，包含 8 个章节 | ✅ 基本一致 | 收款方主体信息待确认（是否为个人还是公司） |
| en.json - Disclaimer | 完整，包含 8 个章节 | ✅ 基本一致 | 无明显缺陷 |
| zh.json legal | 仅 privacy 存在，内容为英文 | ❌ 完全不一致 | 缺失 terms/cookie-policy/refund/disclaimer |
| pt-BR.json legal | 结构存在，内容为英文 | ❌ 完全不一致 | 全部需要翻译为葡萄牙语 |
| es-MX.json legal | 结构存在，内容为英文 | ❌ 完全不一致 | 全部需要翻译为西班牙语 |
| 代码层安全 | 多处问题 | ❌ 与合规声明不一致 | 硬编码白名单、in-memory quota、webhook fail-open |
| Cookie Banner | 存在，但功能有限 | ⚠️ 只有全接受/全拒绝 | 缺乏分类同意 |
| 数据保留期限说明 | 提到 "as long as necessary" | ⚠️ 过于空泛 | 需明确具体天数 |
| 数据删除机制 | /api/account/delete 接口 | ✅ | 可能缺少数据导出功能（GDPR 权利） |

### 还需要增加的合规相关文件/功能

1. **增加完整的联系页面** (`/contact`) — 显示支持邮箱，不仅依赖 WhatsApp
2. **增加数据导出功能** — GDPR Article 20 的数据移植权，用户可以下载自己的所有数据
3. **增加 Cookie 分类接受功能** — 必要/分析/营销分开控制
4. **增加 DPA (Data Processing Addendum) 链接** — 使用了 Supabase、OpenAI/DeepSeek、Stripe 等第三方处理者，对于企业用户可能需要 DPA
5. **完善法律页面版本日志** — 内部记录每次修改时间和原因

---

## 11. 缺失信息清单 [FIXME]

以下信息实际调查时不足，需向用户/团队确认：

- [ ] 运营主体：是个人？公司？公司名称？注册地？
- [ ] 是否使用 Google Analytics、Microsoft Clarity、Plausible 或其他分析工具？
- [ ] 是否使用广告像素（Google Ads、Meta Pixel）？
- [ ] 产品信息和 AI 生成内容的保留期限是多少？（7 天？30 天？6 个月？）
- [ ] 是否接入欧盟/UK/加州用户？当前主要目标是拉丁美洲（BR/MX）
- [ ] 实际支付处理主体是个人还是公司？税号信息？
- [ ] Stripe 的 endpointSecret 是否已配置在生产环境？（开发环境绕过是接受的，但生产环境必须有秘钥）
- [ ] WhatsApp 支持手机号是什么？（当前 wa.me/?text= 没有电话号）
- [ ] 是否已设置邮箱加密存档策略？（可选）

---

> 声明：本报告基于代码库实际内容和模板工作流，不构成正式法律意见。高风险领域（美妆涉及健康声明时）建议咨询执业律师。
