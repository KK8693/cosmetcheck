# Phase 2 关键词映射与内部链接策略

> **与**: PHASE2_OPS_PLAN.md 配套使用  
> **目标**: 形成 Platform ↔ Ingredient ↔ Regulation ↔ Blog 的内部链接网

---

## 一、关键词映射总表

| # | Slug | Target Keyword (EN) | Search Volume* | Difficulty | Funnel | Primary Locale | 必含内部链接目标 URL (≥3 个) |
|---|------|-------------------|----------------|-----------|--------|---------------|---------------------------|
| 1 | anvisa-registration-process-2025 | "ANVISA registration process cosmetics" | 1,200 | Medium | BOFU | pt-BR | /regulation/brazil, /compliance/brazil-anvisa, /guides/anvisa-complete-guide |
| 2 | cofepris-registration-timeline | "COFEPRIS registration timeline" | 800 | Medium | BOFU | es-MX | /regulation/mexico, /compliance/mexico-cofepris, /guides/cofepris-complete-guide |
| 3 | how-to-import-cosmetics-brazil | "how to import cosmetics to Brazil" | 600 | Low | BOFU | en/pt-BR | /regulation/brazil, /status/brazil/banned, /batch, /guides/sell-cosmetics-latam |
| 4 | mexico-cosmetics-import-guide | "import cosmetics to Mexico requirements" | 500 | Low | BOFU | en/es-MX | /regulation/mexico, /status/mexico/banned, /batch, /guides/sell-cosmetics-latam |
| 5 | anvisa-cofepris-comparison-2025 | "ANVISA vs COFEPRIS cosmetics" | 400 | Low | MOFU | en | /regulation/brazil, /regulation/mexico, /guides/anvisa-complete-guide, /guides/cofepris-complete-guide |
| 6 | top-10-banned-ingredients-brazil-2025 | "banned cosmetic ingredients Brazil" | 2,500 | Low | TOFU | en/pt-BR | /status/brazil/banned, /ingredient/hydroquinone, /ingredient/mercury, /regulation/brazil |
| 7 | top-10-banned-ingredients-mexico-2025 | "banned cosmetic ingredients Mexico" | 1,800 | Low | TOFU | en/es-MX | /status/mexico/banned, /ingredient/hydroquinone, /ingredient/lead, /regulation/mexico |
| 8 | preservative-safety-guide | "preservative safety cosmetics guide" | 900 | Low | MOFU | en | /category/preservative, /ingredient/phenoxyethanol, /ingredient/methylparaben, /ingredient/propylparaben |
| 9 | retinol-concentration-limits | "retinol concentration limit ANVISA" | 700 | Low | BOFU | en/pt-BR | /ingredient/retinol, /ingredient/retinoic-acid, /category/actives, /regulation/brazil |
| 10 | how-to-read-inci-list | "how to read INCI list cosmetics" | 3,000 | Low | TOFU | en | /ingredients, /ingredient/sodium-lauryl-sulfate, /ingredient/formaldehyde, /batch |
| 11 | amazon-brazil-seller-guide-cosmetics | "sell cosmetics Amazon Brazil" | 1,500 | Medium | BOFU | en/pt-BR | /platforms/amazon/brazil, /regulation/brazil, /guides/sell-cosmetics-latam, /status/brazil/banned |
| 12 | mercado-livre-mexico-compliance | "Mercado Livre Mexico cosmetics" | 600 | Low | BOFU | es-MX | /platforms/mercado-livre/mexico, /regulation/mexico, /guides/sell-cosmetics-latam |
| 13 | shopee-latam-cosmetics-guide | "Shopee Latin America cosmetics" | 400 | Low | BOFU | en/es-MX | /platforms/shopee/brazil, /platforms/shopee/mexico, /regulation/brazil, /regulation/mexico |
| 14 | cross-border-ecommerce-latam | "cross border ecommerce Latin America" | 1,000 | Low | MOFU | en | /guides/sell-cosmetics-latam, /platforms/compare, /regulation/brazil, /regulation/mexico |
| 15 | marketplace-account-suspension-prevention | "prevent Amazon account suspension cosmetics" | 800 | Medium | BOFU | en | /platforms/amazon/brazil, /platforms/amazon/mexico, /status/brazil/banned, /status/mexico/banned, /compliance/brazil-anvisa |
| 16 | latam-cosmetics-market-size-2025 | "Latin America cosmetics market size 2025" | 700 | Low | TOFU | en | /guides/sell-cosmetics-latam, /brasil, /mexico, /platforms/compare |
| 17 | eu-cosmetics-regulation-vs-latam | "EU vs LATAM cosmetics regulation" | 300 | Low | MOFU | en | /regulation/brazil, /regulation/mexico, /guides/anvisa-complete-guide, /guides/cofepris-complete-guide |
| 18 | organic-natural-cosmetics-certification | "organic cosmetics certification Brazil Mexico" | 500 | Low | MOFU | en | /regulation/brazil, /regulation/mexico, /category/other, /ingredient/alpha-arbutin |
| 19 | sunscreen-regulation-brazil | "sunscreen regulation Brazil ANVISA" | 900 | Low | BOFU | pt-BR | /regulation/brazil, /ingredient/benzophenone-3, /ingredient/octinoxate, /ingredient/homosalate |
| 20 | baby-cosmetics-safety-standards | "baby cosmetics safety standards" | 600 | Low | MOFU | en | /regulation/brazil, /regulation/mexico, /status/brazil/banned, /status/mexico/banned, /category/other |

*Search Volume 为估算值，实际需要 SEMrush/Ahrefs 验证。

---

## 二、内部链接网（核心策略）

### 2.1 链接规则

每个新页面必须包含：

| 页面类型 | 必含内部链接 | 数量 | 目的 |
|----------|-------------|------|------|
| Platform 页 | → Regulation, → Category, → Blog | ≥5 | 上下文信息 + 权威信号 |
| Blog 文章 | → Ingredient, → Regulation, → Platform, → Tool | ≥3 | 教育 + 转化 |
| Ingredient 页 | → Category, → Status, → Regulation, → Blog | ≥4 | 相关内容发现 |
| Regulation 页 | → Compliance tools, → Blog, → Status | ≥3 | 工具使用 + 深度内容 |

### 2.2 内容集群（Content Cluster）

```
Hub: /guides/anvisa-complete-guide
  ├─ Spoke: /blog/anvisa-registration-process-2025
  ├─ Spoke: /blog/top-10-banned-ingredients-brazil-2025
  ├─ Spoke: /blog/sunscreen-regulation-brazil
  ├─ Spoke: /platforms/amazon/brazil
  ├─ Spoke: /platforms/mercado-livre/brazil
  ├─ Spoke: /platforms/shopee/brazil
  ├─ Spoke: /regulation/brazil
  ├─ Spoke: /compliance/brazil-anvisa
  └─ Spoke: /brasil

Hub: /guides/cofepris-complete-guide
  ├─ Spoke: /blog/cofepris-registration-timeline
  ├─ Spoke: /blog/top-10-banned-ingredients-mexico-2025
  ├─ Spoke: /blog/mercado-livre-mexico-compliance
  ├─ Spoke: /platforms/amazon/mexico
  ├─ Spoke: /platforms/mercado-livre/mexico
  ├─ Spoke: /platforms/shopee/mexico
  ├─ Spoke: /regulation/mexico
  ├─ Spoke: /compliance/mexico-cofepris
  └─ Spoke: /mexico

Hub: /guides/sell-cosmetics-latam
  ├─ Spoke: /blog/cross-border-ecommerce-latam
  ├─ Spoke: /blog/amazon-brazil-seller-guide-cosmetics
  ├─ Spoke: /blog/shopee-latam-cosmetics-guide
  ├─ Spoke: /blog/marketplace-account-suspension-prevention
  ├─ Spoke: /blog/latam-cosmetics-market-size-2025
  ├─ Spoke: /blog/eu-cosmetics-regulation-vs-latam
  ├─ Spoke: /platforms/compare
  └─ Spoke: /platforms
```

### 2.3 关键链接模板

**Blog 文章中的内部链接标准格式**：

```html
<!-- 指向 Ingredient 页 -->
<a href="/ingredient/retinol">retinol</a>

<!-- 指向 Regulation 页 -->
<a href="/regulation/brazil">Brazil cosmetic regulations</a>

<!-- 指向 Platform 页 -->
<a href="/platforms/amazon/brazil">Amazon Brazil seller requirements</a>

<!-- 指向 Tool/Compliance 页 -->
<a href="/compliance/brazil-anvisa">Check your product compliance</a>

<!-- 指向 Blog 相关文章 -->
<a href="/blog/anvisa-registration-process-2025">ANVISA registration guide</a>
```

**强制要求**: 所有内部链接必须使用绝对路径（以 `/` 开头），避免带 locale 前缀。

---

## 三、多语言 Hreflang 策略

### 3.1 Blog 文章 Hreflang

每篇 blog 文章的 3 个语言版本必须互相指向：

```html
<link rel="alternate" hreflang="en" href="https://cosmetcheck.com/en/blog/anvisa-registration-process-2025" />
<link rel="alternate" hreflang="pt-BR" href="https://cosmetcheck.com/pt-BR/blog/anvisa-registration-process-2025" />
<link rel="alternate" hreflang="es-MX" href="https://cosmetcheck.com/es-MX/blog/anvisa-registration-process-2025" />
<link rel="alternate" hreflang="x-default" href="https://cosmetcheck.com/en/blog/anvisa-registration-process-2025" />
```

### 3.2 Platform 页面语言处理

Platform 页面走非 locale 路由，采用英文为主、关键术语保留当地语言的策略。

```typescript
// Metadata 中的 alternates 示例
alternates: {
  canonical: `https://cosmetcheck.com/platforms/${platform}/${country}`,
  languages: {
    'en': `/platforms/${platform}/${country}`,
    'pt-BR': `/pt-BR/platforms/${platform}/${country}`,  // 若未本地化，指向英文版本
    'es-MX': `/es-MX/platforms/${platform}/${country}`,
    'x-default': `/en/platforms/${platform}/${country}`,
  }
}
```

> **注**: 如果 Platform 页面暂无 pt-BR/es-MX 本地化版本，请确保 alternates 中的语言链接指向英文版本，避免 404。

---

## 四、Schema 检查清单

### 4.1 Platform 页面 Schema

| 页面层级 | FAQPage | BreadcrumbList | Organization | HowTo | WebPage |
|----------|---------|--------------|--------------|-------|---------|
| /platforms | ✅ ≥5 | ✅ | ✅ | ❌ | ✅ |
| /platforms/[p] | ✅ ≥5 | ✅ | ✅ | ❌ | ✅ |
| /platforms/[p]/[c] | ✅ ≥5 | ✅ | ✅ | ✅ | ✅ |
| /platforms/[p]/[c]/[cat] | ✅ ≥3 | ✅ | ❌ | ❌ | ✅ |
| /platforms/compare | ✅ ≥5 | ✅ | ✅ | ❌ | ✅ |

### 4.2 Blog 文章 Schema

每篇 blog 文章必须包含：

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "...",
  "description": "...",
  "author": {
    "@type": "Organization",
    "name": "CosmetCheck Team"
  },
  "publisher": {
    "@type": "Organization",
    "name": "CosmetCheck",
    "logo": {
      "@type": "ImageObject",
      "url": "https://cosmetcheck.com/logo.png"
    }
  },
  "datePublished": "2025-06-15",
  "dateModified": "2025-06-15",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://cosmetcheck.com/en/blog/anvisa-registration-process-2025"
  }
}
```

**FAQPage Schema** （文章末尾）：

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How long does ANVISA registration take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "..."
      }
    }
  ]
}
```

---

## 五、Sitemap 更新规范

### 5.1 Platform URL 集成

```typescript
// 在 sitemap.ts 中新增：
const platforms = ['amazon', 'mercado-livre', 'shopee']
const countries = ['brazil', 'mexico']
const categories = ['actives', 'corticosteroid', 'hair_coloring', 'other', 'preservative', 'skin_lightening', 'surfactant']

// 添加到 unlocalizedRoutes
const platformRoutes = [
  { path: '/platforms', priority: 0.8, freq: 'weekly' },
  { path: '/platforms/compare', priority: 0.7, freq: 'weekly' },
]

for (const p of platforms) {
  platformRoutes.push({ path: `/platforms/${p}`, priority: 0.7, freq: 'weekly' })
  for (const c of countries) {
    platformRoutes.push({ path: `/platforms/${p}/${c}`, priority: 0.7, freq: 'weekly' })
    for (const cat of categories) {
      platformRoutes.push({ path: `/platforms/${p}/${c}/${cat}`, priority: 0.6, freq: 'monthly' })
    }
  }
}
```

### 5.2 Blog URL 集成

如果 `blog-data.ts` 自动被 `getAllSlugs()` 读取，则 sitemap 无需修改。确认：

```typescript
// sitemap.ts 已通过 allPosts 自动生成 blog URL
const allPosts = [...blogPosts, ...translatedPosts]
```

---

## 六、上线后审计清单

### 6.1 技术审计

- [ ] 所有 53 个 Platform URL 返回 200
- [ ] 无效 platform/country/category 返回 404
- [ ] Sitemap 在 GSC 中解析成功
- [ ] 所有内部链接无死链
- [ ] Core Web Vitals 全部 Pass

### 6.2 SEO 审计

- [ ] 每个 Platform 页面有唯一的 title 和 description
- [ ] 每个 Blog 文章有 Article Schema
- [ ] 每个页面有 BreadcrumbList Schema
- [ ] FAQPage Schema 通过 Google Rich Results Test
- [ ] Hreflang 无错误（无重复/缺失）

### 6.3 内容审计

- [ ] 所有数据点有官方来源支撑
- [ ] 每篇 blog ≥ 3 个内部链接
- [ ] 每篇 blog 有明确的 CTA
- [ ] 每篇 blog 文末有 3-5 条 FAQ
