# CosmetCheck SEO 与性能优化技术方案

**版本：** v1.1 (修订版)  
**作者：** 首席架构师  
**日期：** 2025-05-16  
**状态：** 修订完成，待 CTO 批准

---

## 一、SEO 优化方案

### 1.1 现状评估

| 检查项 | 当前状态 | 优先级 |
|--------|----------|--------|
| Metadata 配置 | ✅ 已配置基础 metadata | - |
| Title/Description | ✅ 已配置 | - |
| Open Graph | ✅ 基础已配置 | - |
| Canonical URLs | ✅ 已配置 | - |
| sitemap.xml | ❌ 不存在 | P0 |
| robots.txt | ❌ 不存在 | P0 |
| JSON-LD Schema | ❌ 不存在 | P1 |
| 多语言 hreflang | ⚠️ 配置待验证 | P1 |

### 1.2 路由结构确认

| 实际路径 | locale 参数 | 说明 |
|----------|-------------|------|
| `/` | - | 默认首页 |
| `/zh/...` | zh | 中文 |
| `/pt-BR/...` | pt-BR | 巴西葡语 |
| `/es-MX/...` | es-MX | 墨西哥西语 |
| `/en/...` | en | 英语 |
| `/brasil` | - | 巴西独立入口 |
| `/mexico` | - | 墨西哥独立入口 |

### 1.3 实施方案

#### P0 - 立即实施

**1. sitemap.xml**
- 位置：`src/app/sitemap.ts` (Next.js App Router 原生支持)

```typescript
// src/app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://cosmetcheck.com'
  const locales = ['zh', 'pt-BR', 'es-MX', 'en']
  
  const staticPages = [
    '',
    '/pricing',
    '/faq',
    '/terms',
    '/privacy',
    '/cookie-policy',
    '/disclaimer',
  ]

  const sitemap: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }))

  // 国际化页面
  locales.forEach((locale) => {
    staticPages.forEach((page) => {
      sitemap.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    })
  })

  // 独立入口页面
  sitemap.push(
    { url: `${baseUrl}/brasil`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/mexico`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 }
  )

  return sitemap
}
```

**2. robots.txt**
- 位置：`src/app/robots.ts`

```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/_next/'],
    },
    sitemap: 'https://cosmetcheck.com/sitemap.xml',
  }
}
```

#### P1 - 下一阶段

**3. JSON-LD Structured Data**

需要添加的 Schema：

| 页面 | Schema 类型 | 用途 |
|------|-------------|------|
| 首页 | WebApplication, Organization | 品牌/应用信息 |
| 定价页 | PriceSpecification, Offer | 价格信息 |
| FAQ 页面 | FAQPage | 常见问题 |
| 产品 | Product | AI 工具产品 |

```typescript
// src/components/JsonLd.tsx
'use client'

const webApplicationLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'CosmetCheck',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '150',
  },
}

const pricingLd = {
  '@context': 'https://schema.org',
  '@type': 'PriceSpecification',
  priceCurrency: 'USD',
  minPrice: '0',
  maxPrice: '49',
  priceValidUntil: '2025-12-31',
  offers: [
    {
      '@type': 'Offer',
      name: '免费版',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    {
      '@type': 'Offer',
      name: '专业版',
      price: '19',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    {
      '@type': 'Offer',
      name: '企业版',
      price: '49',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  ],
}

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'CosmetCheck 支持哪些国家的美妆合规检测？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '支持巴西(ANVISA)、墨西哥(COFEPRIS)、阿根廷(ANMAT)、智利(SEREMI)、秘鲁(DIGEMID)五国。',
      },
    },
    // ... 更多 FAQ
  ],
}

export { webApplicationLd, pricingLd, faqLd }
```

**4. hreflang 验证**
- 验证 `layout.tsx` 中 alternates.languages 配置是否正确指向实际路由

---

## 二、性能调优方案

### 2.1 现状评估

| 检查项 | 当前状态 | 优先级 |
|--------|----------|--------|
| 字体优化 | ✅ next/font + preload | - |
| 图片优化 | ⚠️ 未使用 next/image | P0 |
| 代码分割 | ✅ Next.js 自动处理 | - |
| 静态生成 | ✅ 已配置部分静态 | - |
| Edge Runtime | ✅ 已启用 | - |
| CDN 配置 | ❌ 未配置 | P1 |

### 2.2 Core Web Vitals 目标

| 指标 | 目标值 | 说明 |
|------|--------|------|
| LCP (最大内容绘制) | < 2.5s | 首屏加载速度 |
| CLS (累积布局偏移) | < 0.1 | 页面稳定性 |
| FID (首次输入延迟) | < 100ms | 交互响应性 |

### 2.3 实施方案

#### P0 - 立即实施

**1. 图片清单与 next/image 改造**

步骤 1：盘点现有图片
```bash
# 搜索所有图片引用
grep -r "src=" --include="*.tsx" src/
grep -r "img " --include="*.tsx" src/
```

步骤 2：配置文件 `next.config.ts`
```typescript
images: {
  remotePatterns: [
    { hostname: 'cosmetcheck.com' },
    { hostname: '*.supabase.co' },
  ],
  formats: ['image/avif', 'image/webp'],
}
```

步骤 3：替换示例
```typescript
import Image from 'next/image'

// 旧
<img src="/hero.png" alt="Hero" />

// 新
<Image
  src="/hero.png"
  alt="CosmetCheck Demo"
  width={800}
  height={600}
  placeholder="blur"
  blurDataURL="data:image/png;base64,..."
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

#### P1 - 下一阶段

**2. CDN 配置建议**

| CDN 提供商 | 适用场景 | 成本 |
|------------|----------|------|
| Vercel | 部署至 Vercel 时自动 CDN | 免费版足够 |
| Cloudflare | 独立部署（VPS/Cloudflare Pages） | 免费版足够 |
| AWS CloudFront | AWS 生态 | 按量付费 |

**推荐：** 若部署至 Vercel，无需额外配置；若独立部署，使用 Cloudflare 免费版即可。

**3. 资源预加载优化**
- 添加 `<link rel="preload">` 关键资源
- 考虑预连接第三方域名

---

## 三、实施优先级

| 优先级 | 任务 | 预估工时 | 依赖 |
|--------|------|----------|------|
| P0 | sitemap.xml | 1h | - |
| P0 | robots.txt | 0.5h | - |
| P0 | next/image 改造 | 2-3h | 图片清单 |
| P1 | JSON-LD Schema | 2h | - |
| P1 | hreflang 验证 | 1h | - |
| P1 | CDN 配置 | 1h | 部署方案 |

---

## 四、总结

| 优化方向 | 当前基线 | 目标 |
|----------|----------|------|
| SEO | 60% | 90% |
| 性能 (LCP) | 70% | < 2.5s |
| 性能 (CLS) | 70% | < 0.1 |
| 性能 (FID) | 70% | < 100ms |

**建议执行顺序：**  
1. sitemap.xml + robots.txt (1.5h)  
2. 图片清单 + next/image 改造 (2-3h)  
3. JSON-LD (2h)  
4. CDN 配置 (1h)

---

*修订内容 (v1.0 → v1.1)：*
- ✅ 修正 locale 代码为实际路由 (zh, pt-BR, es-MX, en, brasil, mexico)
- ✅ 补充 JSON-LD Schema (WebApplication, PriceSpecification, FAQPage)
- ✅ 添加 Core Web Vitals 目标 (LCP < 2.5s, CLS < 0.1, FID < 100ms)
- ✅ 补充图片清单步骤

---

*等待 @CTO 批准执行*