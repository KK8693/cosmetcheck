# Phase 2 Batch 1 — 内容生产启动书

> **批次**: Batch 1（Platform 基础设施）  
> **页面数**: 5  
> **负责人**: 运营经理（内容草案）+ 研发（页面实现）  
> **截止日期**: 等待 Phase 1 GSC 提交完成后启动（预计 Day 6-7）  
> **依赖**: `feat/platform-blog-phase2` 分支

---

## 一、Batch 1 页面清单

| # | 路径 | 页面类型 | 优先级 | 复杂度 |
|---|--------|----------|--------|--------|
| 1 | `/platforms` | 索引页 | P0 | 低 |
| 2 | `/platforms/compare` | 对比页 | P0 | 中 |
| 3 | `/platforms/amazon` | 平台概览 | P0 | 中 |
| 4 | `/platforms/mercado-livre` | 平台概览 | P0 | 中 |
| 5 | `/platforms/shopee` | 平台概览 | P0 | 中 |

---

## 二、页面 1: `/platforms` — 平台索引页

### 2.1 SEO Metadata

```typescript
title: "Sell Cosmetics on Amazon, Mercado Livre & Shopee | Latin America Guide | CosmetCheck",
description: "Complete seller guides for cosmetics on Amazon Brazil/Mexico, Mercado Livre, and Shopee. ANVISA & COFEPRIS compliance requirements, prohibited products, and seller checklists.",
```

### 2.2 内容结构

**Hero Section**
- H1: Sell Cosmetics on Latin American Marketplaces
- 副标题: Compliance guides for Amazon, Mercado Livre, and Shopee in Brazil & Mexico
- CTA: Explore Platform Guides

**Platform Cards Grid** (3 卡片)

| 卡片 | 标题 | 要点 | 链接 |
|------|------|------|------|
| Amazon | Amazon Brazil & Mexico | 最大跨境电商平台，要求 ANVISA/COFEPRIS 注册 | /platforms/amazon |
| Mercado Livre | Mercado Livre Brazil & Mexico | 拉美最大本土平台，PTR 要求 | /platforms/mercado-livre |
| Shopee | Shopee Brazil & Mexico | 新兴跨境平台，快速增长市场 | /platforms/shopee |

**Why Compliance Matters Section**
- 3 个数据点:
  1. "Selling unregistered cosmetics in Brazil can result in fines up to R$ 1.5 million"
  2. "Amazon Brazil removed over 12,000 non-compliant cosmetic listings in 2024"
  3. "COFEPRIS reports 30% of imported cosmetics fail initial registration review"
- 来源标注要求：每个数据点需要官方来源或行业报告支撑

**Quick Links Section**
- /platforms/compare
- /regulation/brazil
- /regulation/mexico
- /guides/sell-cosmetics-latam

**FAQ Section** (≥5 条，用于 FAQPage Schema)

1. Which marketplace is best for selling cosmetics in Brazil?
2. Do I need ANVISA registration to sell on Amazon Brazil?
3. What documents are required for COFEPRIS registration?
4. Can foreign sellers sell cosmetics on Mercado Livre?
5. How long does marketplace compliance verification take?

---

## 三、页面 2: `/platforms/compare` — 平台对比页

### 3.1 SEO Metadata

```typescript
title: "Amazon vs Mercado Livre vs Shopee | Cosmetics Seller Comparison 2025 | CosmetCheck",
description: "Compare Amazon, Mercado Livre, and Shopee for cosmetics sellers in Brazil and Mexico. Fees, compliance requirements, audience size, and seller support.",
```

### 3.2 内容结构

**Hero Section**
- H1: Amazon vs Mercado Livre vs Shopee for Cosmetics Sellers
- 副标题: Side-by-side comparison for Brazil & Mexico markets

**Comparison Table** (核心内容)

| 维度 | Amazon | Mercado Livre | Shopee |
|------|--------|---------------|--------|
| Brazil URL | amazon.com.br | mercadolivre.com.br | shopee.com.br |
| Mexico URL | amazon.com.mx | mercadolibre.com.mx | shopee.com.mx |
| 月活跃用户（拉美） | ~150M | ~140M | ~80M |
| 化妆品类目要求 | 严格 | 严格 | 中等 |
| ANVISA/COFEPRIS 必需 | 是 | 是 | 是 |
| 注册费用 | 免费-$39.99/月 | 免费起 | 免费起 |
| 佣金比例 | 8-15% | 11-20% | 5-10% |
| 本地公司要求 | 推荐 | 推荐 | 不必须 |
| PTR/RT 要求（巴西） | 必须 | 必须 | 必须 |
| 中文/英文支持 | 有限 | 有限 | 中文团队支持 |

> **数据准确性警告**: 上表中的数据需要从官方渠道验证。如无法确认，标注 "Based on industry estimates as of 2025."

**Recommendation Section**
- 适合 Amazon 的卖家: 已有品牌知名度，追求高体量
- 适合 Mercado Livre 的卖家: 本土市场深度，接受较高佣金
- 适合 Shopee 的卖家: 价格敏感产品，追求低成本入场

**CTA**: 每个平台卡片带 "View [Platform] Guide" 按钮

**Internal Links**
- /platforms/amazon, /platforms/mercado-livre, /platforms/shopee
- /regulation/brazil, /regulation/mexico
- /guides/sell-cosmetics-latam

---

## 四、页面 3: `/platforms/amazon` — Amazon 概览页

### 4.1 SEO Metadata

```typescript
title: "Sell Cosmetics on Amazon Brazil & Mexico | 2025 Seller Compliance Guide | CosmetCheck",
description: "Complete guide to selling cosmetics on Amazon Brazil (amazon.com.br) and Amazon Mexico (amazon.com.mx). ANVISA/COFEPRIS registration, fees, and prohibited products.",
```

### 4.2 内容结构

**Hero Section**
- H1: Amazon Cosmetics Seller Guide — Brazil & Mexico
- 副标题: ANVISA & COFEPRIS compliance requirements for Amazon marketplace sellers

**Platform Overview**
- Amazon Brazil (amazon.com.br): 市场规模、用户特征
- Amazon Mexico (amazon.com.mx): 市场规模、用户特征
- 两个市场的关键差异

**Country Cards** (2 个大卡片)

| 元素 | Brazil | Mexico |
|------|--------|--------|
| 市场地址 | amazon.com.br | amazon.com.mx |
| 注册要求 | ANVISA Cadastro/Registro | COFEPRIS Registro Sanitario |
| PTR 要求 | 必须 | N/A |
| 标签语言 | 葡萄牙语 | 西班牙语 |
| 常见违规 | 未注册产品、医疗声称 | 未注册产品、NOM 不符合 |
| 链接 | /platforms/amazon/brazil | /platforms/amazon/mexico |

**Seller Requirements Summary**
- 账户类型：Individual vs Professional
- 税务信息要求
- 银行账户要求

**Compliance Checklist**
- [ ] ANVISA/COFEPRIS 注册号显示在列表中
- [ ] 产品标签符合当地法规
- [ ] 禁用成分检查
- [ ] PTR 指定（巴西专有）

**FAQ** (≥5 条)

1. Do I need a Brazilian company to sell on Amazon Brazil?
2. How do I display ANVISA registration on my Amazon listing?
3. What happens if my cosmetic product is reported as non-compliant?
4. Can I ship cosmetics to Brazil via Amazon FBA?
5. How long does Amazon take to verify cosmetic compliance documents?

---

## 五、页面 4: `/platforms/mercado-livre` — Mercado Livre 概览页

### 5.1 SEO Metadata

```typescript
title: "Sell Cosmetics on Mercado Livre Brazil & Mexico | 2025 Compliance Guide | CosmetCheck",
description: "Complete guide to selling cosmetics on Mercado Livre Brazil and Mexico. ANVISA/COFEPRIS requirements, seller fees, and category restrictions.",
```

### 5.2 内容结构

**Hero Section**
- H1: Mercado Livre Cosmetics Seller Guide — Brazil & Mexico
- 副标题: Latin America's largest marketplace — compliance requirements for beauty sellers

**Platform Overview**
- Mercado Livre 是拉丁美洲最大的电商平台
- Brazil (mercadolivre.com.br): 市场特点
- Mexico (mercadolibre.com.mx): 市场特点

**Key Differentiators**
- 本土化程度高
- 支持多种支付方式（Mercado Pago）
- 对海外卖家的特殊要求

**Country Cards**

| 元素 | Brazil | Mexico |
|------|--------|--------|
| 市场地址 | mercadolivre.com.br | mercadolibre.com.mx |
| 注册要求 | ANVISA 注册 + PTR | COFEPRIS 注册 |
| 特殊政策 | 美妆品类目审核严格 | 产品描述禁止医疗声称 |
| 链接 | /platforms/mercado-livre/brazil | /platforms/mercado-livre/mexico |

**FAQ** (≥5 条)

1. What is PTR and why does Mercado Livre Brazil require it?
2. Can I sell imported cosmetics on Mercado Livre without local registration?
3. How does Mercado Livre handle counterfeit cosmetic reports?
4. What are Mercado Livre's commission rates for beauty products?
5. Do I need a local warehouse to sell on Mercado Livre?

---

## 六、页面 5: `/platforms/shopee` — Shopee 概览页

### 6.1 SEO Metadata

```typescript
title: "Sell Cosmetics on Shopee Brazil & Mexico | 2025 Seller Guide | CosmetCheck",
description: "Guide to selling cosmetics on Shopee Brazil (shopee.com.br) and Shopee Mexico (shopee.com.mx). Registration requirements, fees, and compliance for beauty sellers.",
```

### 6.2 内容结构

**Hero Section**
- H1: Shopee Cosmetics Seller Guide — Brazil & Mexico
- 副标题: The fastest-growing e-commerce platform in Latin America

**Platform Overview**
- Shopee 在拉丁美洲的快速增长
- 跨境卖家友好的政策
- 与 Amazon/ML 的主要差异

**Key Features**
- 低佣金率
- 免费运营支持
- 社交电商功能（Shopee Live）

**Country Cards**

| 元素 | Brazil | Mexico |
|------|--------|--------|
| 市场地址 | shopee.com.br | shopee.com.mx |
| 注册要求 | ANVISA + 完整认证 | COFEPRIS + 完整认证 |
| 特点 | 跨境卖家政策较新 | 市场相对新兴 |
| 链接 | /platforms/shopee/brazil | /platforms/shopee/mexico |

**FAQ** (≥5 条)

1. Is Shopee Brazil suitable for cross-border cosmetic sellers?
2. What certifications are required for cosmetics on Shopee?
3. How does Shopee handle product returns for cosmetics?
4. Can I use Shopee's logistics network for cosmetics?
5. What are the marketing tools available for beauty sellers on Shopee?

---

## 七、数据需求清单（交由研发）

### 7.1 数据模型: `src/data/platform-guides.ts`

需要创建的核心数据文件，包含 3 个平台的完整数据。详见 TASKS_PHASE2_PLATFORM_BLOG.md 第 3.1 节。

### 7.2 页面组件清单

| 组件 | 用途 | Batch 1 需要 |
|------|------|-------------|
| `PlatformComplianceCard` | 平台概览卡片 | 是 |
| `PlatformCompareTable` | 对比表格 | 是（仅 /platforms/compare） |
| `FAQSection` | FAQ 展示 + FAQPage Schema | 是 |
| `BreadcrumbList` | 面包屑导航 + Schema | 是 |
| `DisclaimerFooter` | 免责声明 | 是 |

### 7.3 Schema 要求

| 页面 | FAQPage | BreadcrumbList | Organization | WebPage |
|------|---------|--------------|--------------|---------|
| /platforms | ✅ | ✅ | ✅ | ✅ |
| /platforms/compare | ✅ | ✅ | ❌ | ✅ |
| /platforms/amazon | ✅ | ✅ | ✅ | ✅ |
| /platforms/mercado-livre | ✅ | ✅ | ✅ | ✅ |
| /platforms/shopee | ✅ | ✅ | ✅ | ✅ |

---

## 八、内容生产时间线

| 阶段 | 任务 | 负责人 | 预计工时 | 依赖 |
|------|------|--------|----------|------|
| Day 1 | 运营完成内容草案（本文档） | 运营 | 4h | — |
| Day 2-3 | 研发创建数据模型 + 组件 | 研发 | 8h | 内容草案 |
| Day 3-4 | 运营填充正文内容 | 运营 | 6h | 数据模型 |
| Day 4-5 | 研发实现页面 + Schema | 研发 | 8h | 正文内容 |
| Day 5 | 联合 QA 和修复 | 运营+研发 | 4h | 页面实现 |
| Day 6 | GSC 提交 Batch 1 | 运营 | 1h | 部署上线 |

**总工时**: ~31 小时  
**从启动到上线**: ~6 天

---

## 九、验证 Checklist（上线前必须通过）

- [ ] 所有 5 个 URL 返回 200
- [ ] 每页包含唯一的 title 和 description
- [ ] 每页包含 BreadcrumbList Schema
- [ ] 每页包含 FAQPage Schema（≥5 条）
- [ ] 内部链接无死链
- [ ] 免责声明显示在页面底部
- [ ] 所有外部链接附带 `rel="nofollow noopener"`
- [ ] 移动端渲染正常
- [ ] Core Web Vitals Pass
