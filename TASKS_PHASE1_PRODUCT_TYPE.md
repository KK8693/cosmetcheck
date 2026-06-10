# CosmetCheck 技术任务书 — Phase 1: Product Type 组合页

**优先级：** P0（Week 1 完成）  
**目标 URL 增量：** 40 页（20 product types × 2 countries）  
**预计工时：** 2-3 天  
**分支：** 从 `main` 切出 `feat/product-type-pages`

---

## 一、任务概述

创建 `/products/[type]/[country]` 动态路由，为 20 种化妆品产品类型 × 2 个国家（Brazil/Mexico）生成 40 个静态页面。每页回答："某产品类型在某国的合规要求是什么？"

这些页面是**高商业意图**流量入口（用户搜 "sunscreen Brazil regulation"、"shampoo ANVISA requirements" 等）。

---

## 二、交付物清单

| # | 文件 | 说明 |
|---|------|------|
| 1 | `src/data/product-types.ts` | 产品类型数据模型 + 20 条数据 |
| 2 | `src/app/products/[type]/[country]/page.tsx` | 动态路由页面组件 |
| 3 | `src/app/products/page.tsx` | 产品类型索引页 |
| 4 | `src/app/sitemap.ts` | 更新，加入 products 路由 |
| 5 | `src/components/ProductComplianceCard.tsx` | 复用组件：合规状态卡片 |
| 6 | `src/components/ProductTypeFAQ.tsx` | FAQ 组件（带 Schema） |

---

## 三、数据规范：`src/data/product-types.ts`

### 3.1 类型定义

```typescript
export interface ProductTypeData {
  slug: string
  names: {
    en: string
    'pt-BR': string
    es: string
    zh: string
  }
  descriptions: {
    en: string
    'pt-BR': string
    es: string
    zh: string
  }
  // 每个国家的合规框架
  complianceByCountry: {
    brazil: CountryCompliance
    mexico: CountryCompliance
  }
  // 此产品类型常见的限制/禁用成分（引用 ingredient slug）
  commonRestrictedIngredients: string[]
  // 标签要求要点
  labelRequirements: {
    en: string[]
    'pt-BR': string[]
    es: string[]
    zh: string[]
  }
}

export interface CountryCompliance {
  regulator: string        // e.g., "ANVISA"
  regulationName: string   // e.g., "RDC 729/2023"
  registrationRequired: boolean
  registrationType: string // e.g., "Cadastro" or "Registro"
  testingRequirements: string[]
  notes: string
}
```

### 3.2 20 个 Product Type 清单

```
skincare, moisturizer, serum, sunscreen, anti-aging,
acne-treatment, whitening, hair-care, shampoo, conditioner,
hair-dye, makeup, foundation, lipstick, mascara, fragrance,
deodorant, baby-care, oral-care, nail-products
```

### 3.3 数据内容要求

每个 Product Type 的 `complianceByCountry` 必须包含**真实合规信息**，基于：
- Brazil: ANVISA RDC 729/2023（化妆品注册分类）、RDC 301/2019（标签）
- Mexico: COFEPRIS NOM-141-SSA1、NOM-259-SSA1

`commonRestrictedIngredients` 从此列表中选择（引用已有 ingredient slug）：
```
arsenic, lead, mercury, hydroquinone, formaldehyde,
retinoic-acid, betamethasone, triclosan, phenacetin,
quaternium-15, hexachlorophene, chloramphenicol,
corticosteroids, mercury-compounds, bithionol,
cadmium, cloroxylenol, thallium, mequinol
```

**数据准确性要求：** 每个声明必须有法规依据，不能编造。不确定的字段留空字符串，不要猜。

---

## 四、页面规范：`src/app/products/[type]/[country]/page.tsx`

### 4.1 路由参数

- `type`: 20 个 product type slug 之一
- `country`: `"brazil" | "mexico"`

### 4.2 静态生成

```typescript
export async function generateStaticParams() {
  const types = getAllProductTypeSlugs()
  const countries = ['brazil', 'mexico']
  return types.flatMap(type =>
    countries.map(country => ({ type, country }))
  )
}
```

### 4.3 Metadata（SEO 核心）

```typescript
export async function generateMetadata({ params }: Props) {
  const { type, country } = params
  const data = getProductTypeData(type)
  const countryName = country === 'brazil' ? 'Brazil' : 'Mexico'
  const productName = data.names.en

  return {
    title: `${productName} Regulation in ${countryName} | ANVISA/COFEPRIS Compliance | CosmetCheck`,
    description: data.descriptions.en,
    alternates: {
      canonical: `https://cosmetcheck.com/products/${type}/${country}`,
      languages: {
        'en': `/products/${type}/${country}`,
        'zh-CN': `/zh/products/${type}/${country}`,
        'pt-BR': `/pt-BR/products/${type}/${country}`,
        'es': `/es/products/${type}/${country}`,
        'x-default': `/en/products/${type}/${country}`,
      },
    },
  }
}
```

**重要：** 参考现有 `src/app/ingredient/[slug]/page.tsx` 的 metadata 实现模式，保持一致。

### 4.4 页面内容结构（从上到下）

1. **Breadcrumb**（Schema + 可视化）
   ```
   Home > Products > {Product Type} > {Country}
   ```

2. **H1**: `{Product Name} Regulatory Requirements in {Country}`

3. **合规概览卡片**
   - 监管机构图标 + 名称
   - 注册要求：是/否
   - 注册类型
   - 关键法规链接

4. **限制成分表格**
   - 引用 `commonRestrictedIngredients`
   - 显示成分名称、状态（Banned/Restricted）、法规来源
   - 点击跳转到 `/ingredient/[slug]`

5. **标签要求清单**
   - 无序列表展示 `labelRequirements`

6. **FAQ 区域（带 JSON-LD Schema）**
   - 至少 5 条 FAQ
   - 每条包含 question + answer
   - 渲染 `<script type="application/ld+json">` 的 FAQPage Schema

7. **CTA 区域**
   - "Check Your Product Ingredients" → 链接到首页搜索
   - "View All Banned Ingredients in {Country}" → 链接到 `/status/{country}/banned`

### 4.5 Schema 要求

每个页面必须包含两个 JSON-LD Script：

**FAQPage Schema：**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Do I need to register {product} in {country}?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "..."
      }
    }
  ]
}
```

**BreadcrumbList Schema：**
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://cosmetcheck.com"},
    {"@type": "ListItem", "position": 2, "name": "Products", "item": "https://cosmetcheck.com/products"},
    {"@type": "ListItem", "position": 3, "name": "{Product}", "item": "https://cosmetcheck.com/products/{type}"},
    {"@type": "ListItem", "position": 4, "name": "{Country}", "item": "https://cosmetcheck.com/products/{type}/{country}"}
  ]
}
```

---

## 五、索引页：`src/app/products/page.tsx`

### 5.1 内容

- H1: "Cosmetic Product Compliance by Type & Country"
- 简介：2-3 句话说明页面用途
- 网格布局展示 20 个 Product Type 卡片
- 每个卡片显示：产品类型名称、Brazil 链接、Mexico 链接

### 5.2 Metadata

```typescript
export const metadata = {
  title: 'Cosmetic Product Compliance Guide by Type | CosmetCheck',
  description: '...',
  alternates: {
    canonical: 'https://cosmetcheck.com/products',
    languages: { /* 同 4.3 模式 */ }
  }
}
```

---

## 六、Sitemap 更新

修改 `src/app/sitemap.ts`，在 `urls` 数组中添加：

```typescript
// Product type pages
const productTypes = getAllProductTypeSlugs()
const countries = ['brazil', 'mexico']

for (const type of productTypes) {
  for (const country of countries) {
    urls.push({
      url: `${baseUrl}/products/${type}/${country}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  }
}

// Products index
urls.push({
  url: `${baseUrl}/products`,
  lastModified: new Date(),
  changeFrequency: 'weekly',
  priority: 0.8,
})
```

---

## 七、样式与组件规范

### 7.1 使用现有设计系统

- 颜色：沿用现有 Tailwind 配置（indigo/purple 主题）
- 卡片：参考 `IngredientCard` 或 `StatusCard` 组件风格
- 排版：H1 用 `text-3xl font-bold`，正文用 `text-gray-600`

### 7.2 响应式

- Mobile: 单列布局
- Tablet+: 双列网格（Product Type 卡片）
- Desktop: 三列网格

### 7.3 复用组件要求

创建 `src/components/ProductComplianceCard.tsx`：
- 接收 `ProductTypeData` + `country` props
- 渲染合规概览卡片
- 在动态路由页面中复用

---

## 八、测试 checklist

开发完成后，在本地执行：

```bash
npm run build
# 必须无 TypeScript 错误
# 必须无 ESLint 错误
```

验证点：
- [ ] `http://localhost:3000/products` 正常渲染
- [ ] `http://localhost:3000/products/sunscreen/brazil` 正常渲染
- [ ] `http://localhost:3000/products/sunscreen/mexico` 正常渲染
- [ ] 页面源码中包含正确的 `<link rel="canonical">`
- [ ] 页面源码中包含正确的 `<link rel="alternate" hreflang="...">`（含 x-default）
- [ ] 页面源码中包含 FAQPage JSON-LD
- [ ] 页面源码中包含 BreadcrumbList JSON-LD
- [ ] Sitemap XML 包含所有 `/products/*` URL
- [ ] 404 页面：访问 `/products/invalid-type/brazil` 返回 404

---

## 九、提交规范

```bash
git checkout -b feat/product-type-pages
# ... 开发 ...
git add .
git commit -m "feat(products): add product type × country compliance pages

- Add 20 product types with Brazil/Mexico compliance data
- Create /products/[type]/[country] dynamic route (40 pages)
- Create /products index page
- Add FAQPage and BreadcrumbList Schema
- Update sitemap with product type URLs
- Add ProductComplianceCard reusable component"
```

---

## 十、注意事项

1. **不要** 为这 40 页创建 locale 路由（如 `/en/products/...`）。沿用现有 ingredient 页面的非 locale 路由模式，简化实施。
2. **不要** 在页面中硬编码 API key 或敏感信息。
3. **必须** 确保 `commonRestrictedIngredients` 中引用的 slug 在现有 `ingredients-database.ts` 中存在，否则链接会 404。
4. **FAQ 答案** 必须基于真实法规，不确定的内容标注 "Subject to current ANVISA/COFEPRIS regulations"。

---

**交付截止：本周五前提交 PR，@CTO 审核后合并。**
