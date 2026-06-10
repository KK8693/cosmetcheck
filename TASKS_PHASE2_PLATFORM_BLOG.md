# CosmetCheck 技术任务书 — Phase 2: Platform 合规页 + Blog 集群

**优先级：** P0（下月执行）  
**目标 URL 增量：** ~200 页  
**预计工时：** 2 周  
**分支：** 从 `main` 切出 `feat/platform-blog-phase2`

---

## 一、任务概述

### Part A: Platform 合规页面体系

创建三大跨境电商平台（Amazon / Mercado Livre / Shopee）× 两个国家（Brazil / Mexico）× 七大品类的层级化合规指南。目标是捕捉这类高价值搜索查询：

- "sell cosmetics on Amazon Brazil"
- "Mercado Livre cosmetic requirements Mexico"
- "Shopee banned products Brazil"
- "Amazon ANVISA registration requirements"

### Part B: Blog 集群扩展

批量发布 20 篇深度文章，覆盖 ANVISA/COFEPRIS 合规、平台运营、成分安全等话题。每篇文章支持 3 个语言版本。

---

## 二、URL 增量计算

### Part A: Platform 页面（~100 URLs）

| 路由 | 数量 | 说明 |
|-------|------|------|
| `/platforms` | 1 | 平台索引页 |
| `/platforms/[platform]` | 3 | 平台概览（amazon, mercado-livre, shopee） |
| `/platforms/[platform]/[country]` | 6 | 平台×国家详情 |
| `/platforms/[platform]/[country]/[category]` | 42 | 平台×国家×品类（3×2×7） |
| `/platforms/compare` | 1 | 平台对比页 |
| **小计** | **53** | |

> 注：Platform 页面走**非 locale 路由**（与 ingredient 页面一致），简化实施。内容以英文为主，关键术语保留当地语言。

### Part B: Blog 扩展（~100 URLs）

| 类型 | 数量 | 说明 |
|-------|------|------|
| 新增文章 | 20 篇 | 每篇支持 3 locales |
| 文章 URL | 60 | 20 × 3 (pt-BR, es-MX, en) |
| Blog 索引页更新 | 1 | 更新 `/[locale]/blog` 以展示新文章 |
| 分类页 | ~14 | 7 categories × 主要 locales |
| **小计** | **~75** | |

**合计新增 URL: ~128**

加上 Phase 1 增量（~45）和现有 URL（~230），总计约 **~403 URLs**。

若需达到 800 URLs，建议后续增加：
- Ingredient 精选扩展（现有 54 → 120）：+66 URLs
- 新增国家（Colombia/Argentina/Chile/Peru）：+100+ URLs
- 平台×产品类型组合页：+60 URLs

---

## 三、Part A: Platform 页面体系

### 3.1 数据模型: `src/data/platform-guides.ts`

```typescript
export interface PlatformGuide {
  slug: string
  name: string
  logo?: string
  website: string
  description: string
  countries: PlatformCountryGuide[]
}

export interface PlatformCountryGuide {
  country: 'brazil' | 'mexico'
  countryName: string
  marketplaceUrl: string        // e.g., "amazon.com.br"
  overview: string
  
  // 化妆品特定政策
  cosmeticsPolicy: {
    allowed: boolean
    restrictions: string[]
    prohibitedCategories: string[]
    registrationRequired: boolean
    documentsNeeded: string[]
  }
  
  // 销售要求
  sellerRequirements: {
    accountType: string         // e.g., "Individual" or "Professional"
    taxIdRequired: boolean
    localEntityRequired: boolean
    responsibleTechnicianRequired: boolean  // PTR for Brazil
  }
  
  // 标签/列表要求
  listingRequirements: string[]
  
  // 常见违规类型
  commonViolations: string[]
  
  // 合规检查清单
  complianceChecklist: string[]
  
  // 每品类的特定要求
  categoryGuides: PlatformCategoryGuide[]
  
  // FAQ
  faq: { question: string; answer: string }[]
  
  // 引用相关法规页面
  relatedRegulations: string[]  // e.g., ["/regulation/brazil", "/regulation/mexico"]
}

export interface PlatformCategoryGuide {
  categorySlug: string   // 引用现有 category-index.ts 中的 slug
  categoryName: string
  specificRestrictions: string[]
  documentationRequired: string[]
  examples: string[]
}
```

### 3.2 三大平台数据要求

#### Amazon
- **Brazil**: amazon.com.br
  - 化妆品需要 PTR（Responsável Técnico）
  - ANVISA 注册号必须在列表中显示
  - 禁止销售未注册医疗器械类产品
- **Mexico**: amazon.com.mx
  - COFEPRIS 注册必需
  - NOM 标准适用
  - 标签必须包含西班牙语或葡萄牙语

#### Mercado Livre
- **Brazil**: mercadolivre.com.br
  - 作为拉丁美洲最大电商平台，对化妆品监管严格
  - 需要提供 ANVISA 注册号
  - 部分品类（如防晒）需额外审批
- **Mexico**: mercadolibre.com.mx
  - 需要 COFEPRIS 注册
  - 产品描述不得包含医疗声称

#### Shopee
- **Brazil**: shopee.com.br
  - 快速增长的跨境平台
  - 对海外卖家的化妆品政策较新
  - 需要提供完整的产品认证文件
- **Mexico**: shopee.com.mx
  - 相对较新的市场
  - 需要符合当地化妆品法规

**数据准确性要求：**
- 所有平台政策声明必须基于平台官方卖家政策页面（不确定的内容标注并提供官方链接）
- 法规引用必须与现有 `/regulation/brazil` 和 `/regulation/mexico` 页面一致

### 3.3 七大品类要求

与现有 `category-index.ts` 保持一致：
```
actives, corticosteroid, hair_coloring, other, 
preservative, skin_lightening, surfactant
```

每个 platform×country 组合下的每个品类需要：
- 该品类在此平台的特定限制
- 需要的额外文件
- 典型违规案例

### 3.4 页面路由与组件

| 文件 | 说明 |
|------|------|
| `src/data/platform-guides.ts` | 平台数据模型 + 3 平台完整数据 |
| `src/app/platforms/page.tsx` | 平台索引页 |
| `src/app/platforms/[platform]/page.tsx` | 平台概览页 |
| `src/app/platforms/[platform]/[country]/page.tsx` | 平台×国家详情页 |
| `src/app/platforms/[platform]/[country]/[category]/page.tsx` | 平台×国家×品类页 |
| `src/app/platforms/compare/page.tsx` | 平台对比页 |
| `src/components/PlatformComplianceCard.tsx` | 平台合规卡片组件 |
| `src/components/PlatformCategoryTable.tsx` | 品类要求表格 |

### 3.5 SEO 规范

每个页面必须包含：

**Metadata 模板（以 `/platforms/[platform]/[country]` 为例）：**
```typescript
title: `${platformName} Cosmetics Requirements in ${countryName} | 2025 Seller Guide | CosmetCheck`,
description: `Complete compliance guide for selling cosmetics on ${platformName} in ${countryName}. ANVISA/COFEPRIS requirements, prohibited products, and seller checklist.`,
alternates: {
  canonical: `https://cosmetcheck.com/platforms/${platform}/${country}`,
  languages: {
    'en': `/platforms/${platform}/${country}`,
    'zh-CN': `/zh/platforms/${platform}/${country}`,
    'pt-BR': `/pt-BR/platforms/${platform}/${country}`,
    'es': `/es/platforms/${platform}/${country}`,
    'x-default': `/en/platforms/${platform}/${country}`,
  }
}
```

**Schema 要求：**
- FAQPage JSON-LD（至少 5 条）
- BreadcrumbList JSON-LD
- Organization Schema（平台信息）
- HowTo Schema（卖家注册流程）

### 3.6 平台对比页 `/platforms/compare`

对比三大平台在巴西和墨西西哥的：
- 注册要求
- 费用结构
- 化妆品政策严格程度
- 市场规模
- 推荐入门平台

---

## 四、Part B: Blog 集群扩展

### 4.1 文章主题清单（20 篇）

**分为 4 个主题组：**

**组 1: 注册与合规实操（5 篇）**
1. `anvisa-registration-process-2025` — ANVISA 注册流程完整指南（2025 更新）
2. `cofepris-registration-timeline` — COFEPRIS 注册时间线与费用
3. `how-to-import-cosmetics-brazil` — 如何进口化妆品到巴西
4. `mexico-cosmetics-import-guide` — 墨西西哥化妆品进口指南
5. `anvisa-cofepris-comparison-2025` — ANVISA vs COFEPRIS 完整对比

**组 2: 成分与安全（5 篇）**
6. `top-10-banned-ingredients-brazil-2025` — 巴西禁用成分 Top 10
7. `top-10-banned-ingredients-mexico-2025` — 墨西哥禁用成分 Top 10
8. `preservative-safety-guide` — 防腐剂安全使用指南
9. `retinol-concentration-limits` — 视黄醇浓度限制解读
10. `how-to-read-inci-list` — 如何阅读化妆品成分表

**组 3: 平台运营（5 篇）**
11. `amazon-brazil-seller-guide-cosmetics` — Amazon 巴西化妆品卖家指南
12. `mercado-livre-mexico-compliance` — Mercado Livre 墨西西哥合规要求
13. `shopee-latam-cosmetics-guide` — Shopee 拉丁美洲化妆品指南
14. `cross-border-ecommerce-latam` — 拉丁美洲跨境电商入门
15. `marketplace-account-suspension-prevention` — 如何避免平台账号封禁

**组 4: 市场趋势与深度（5 篇）**
16. `latam-cosmetics-market-size-2025` — 2025 拉丁美洲化妆品市场规模
17. `eu-cosmetics-regulation-vs-latam` — 欧盟化妆品法 vs 拉丁美洲
18. `organic-natural-cosmetics-certification` — 有机/天然化妆品认证指南
19. `sunscreen-regulation-brazil` — 巴西防晒需法规解读
20. `baby-cosmetics-safety-standards` — 婴幼儿化妆品安全标准

### 4.2 内容要求

每篇文章必须包含：
- **标题**：包含 target keyword，60 字符以内
- **摘要**：150-160 字符，包含主要关键词
- **正文**：2000-3000 字，带 H2/H3 标题结构
- **内部链接**：至少 3 个指向站内其他页面（ingredient、regulation、product type 等）
- **CTA**：文末引导使用 CosmetCheck 工具
- **文章 Schema**：Article JSON-LD（author, datePublished, dateModified）
- **FAQ Schema**：文末底部 3-5 条 FAQ

### 4.3 多语言版本

现有 blog 系统支持 `pt-BR`、`es-MX`、`en` 三个 locale。

每篇新文章需要：
1. 先用英文写核心内容（存入 `blog-data.ts`）
2. 翻译为 pt-BR 和 es-MX（存入 `blog-translated.ts`）

**翻译质量要求：**
- 不是机翻，需要本地化表达
- 保留所有数据点、数字、法规引用
- 关键词适当本地化（如 pt-BR 使用 "registro ANVISA"、es-MX 使用 "registro COFEPRIS"）

### 4.4 修改现有文件

**修改 `src/lib/blog-data.ts`:**
- 添加 20 篇新文章的英文版本

**修改 `src/lib/blog-translated.ts`:**
- 添加 20 篇文章的 pt-BR 和 es-MX 翻译

**修改 `src/app/[locale]/blog/page.tsx`:**
- 更新以展示新增文章
- 按分类（category）筛选

**更新 `src/app/sitemap.ts`:**
- 添加新增 blog 文章 URL

---

## 五、Sitemap 更新

### 5.1 Platform URL 生成

```typescript
const platforms = ['amazon', 'mercado-livre', 'shopee']
const countries = ['brazil', 'mexico']
const categories = ['actives', 'corticosteroid', 'hair_coloring', 'other', 'preservative', 'skin_lightening', 'surfactant']

// Platform index
urls.push({ url: `${baseUrl}/platforms`, priority: 0.8 })
urls.push({ url: `${baseUrl}/platforms/compare`, priority: 0.7 })

// Platform pages
for (const platform of platforms) {
  urls.push({ url: `${baseUrl}/platforms/${platform}`, priority: 0.7 })
  for (const country of countries) {
    urls.push({ url: `${baseUrl}/platforms/${platform}/${country}`, priority: 0.7 })
    for (const category of categories) {
      urls.push({ url: `${baseUrl}/platforms/${platform}/${country}/${category}`, priority: 0.6 })
    }
  }
}
```

### 5.2 Blog URL 生成

```typescript
// 现有 sitemap 已包含 blog URL，只需确保新文章被自动包含
// 如果 getAllSlugs() 已经自动读取 blog-data.ts，则无需修改
```

---

## 六、测试 Checklist

### Part A: Platform 页面

- [ ] `/platforms` 正常渲染
- [ ] `/platforms/amazon` 正常渲染
- [ ] `/platforms/amazon/brazil` 正常渲染
- [ ] `/platforms/amazon/brazil/preservative` 正常渲染
- [ ] `/platforms/compare` 正常渲染
- [ ] 无效 platform 返回 404
- [ ] 无效 country 返回 404
- [ ] 无效 category 返回 404
- [ ] 每页包含 FAQPage Schema
- [ ] 每页包含 BreadcrumbList Schema
- [ ] Sitemap 包含所有 platform URL

### Part B: Blog 集群

- [ ] `npm run build` 无错误
- [ ] 所有 20 篇新文章在 3 个 locale 下都可访问
- [ ] `/en/blog/new-article-slug` 正常渲染
- [ ] `/pt-BR/blog/new-article-slug` 正常渲染
- [ ] `/es-MX/blog/new-article-slug` 正常渲染
- [ ] 文章内部链接正确
- [ ] Article Schema 完整

---

## 七、提交规范

```bash
git checkout -b feat/platform-blog-phase2

# Part A 开发完成后提交：
git add .
git commit -m "feat(platforms): add Amazon/Mercado Livre/Shopee compliance guides

- Add 3 platform guides with Brazil/Mexico data
- Create /platforms/[platform]/[country]/[category] routes (42 pages)
- Add platform comparison page
- Add FAQPage, BreadcrumbList, HowTo Schema
- Update sitemap"

# Part B 开发完成后提交：
git add .
git commit -m "feat(blog): add 20 new SEO articles (ANVISA/COFEPRIS/platform guides)

- Add 20 new blog posts in EN/PT/ES
- Cover registration, ingredients, platforms, market trends
- Update blog index with category filtering
- Add Article and FAQ Schema"
```

---

## 八、注意事项

1. **数据准确性**：平台政策信息必须来源于官方卖家中心，不确定的内容标注 "Based on [platform] seller policies as of [date]"。
2. **内部链接**：平台页面必须链接到相关 ingredient、regulation、product type 页面，形成内部链接网。
3. **Blog 文章**：不要使用 AI 生成的通用套话，每篇必须有具体的法规引用、数据点、步骤指南。
4. **图片**：如需平台 logo，使用 SVG 或加载平台官方 favicon，避免版权问题。
5. **性能**：Platform 页面静态生成，确保构建时间在可接受范围内。

---

**交付截止：下月最后一个周五前提交 PR，@CTO 审核后合并。**
