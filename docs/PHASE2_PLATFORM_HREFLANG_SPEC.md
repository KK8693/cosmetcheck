# Platform 页面 Hreflang 技术规范

> **编制**: 运营与客户成功经理  
> **审批**: CTO 2026-06-10  
> **目标**: 确保 Platform 非 locale 路由与 Blog locale 路由的 hreflang 一致性

---

## 一、问题背景

Phase 2 引入了两种路由模式并存：

| 路由模式 | 路径示例 | 说明 |
|----------|----------|------|
| 非 locale 路由 | `/platforms/amazon/brazil` | 与 `/ingredient/[slug]` 一致，无 locale 前缀 |
| Locale 路由 | `/en/blog/anvisa-registration-process-2025` | 带 locale 前缀（en, pt-BR, es-MX, zh） |

当前站点的 canonical 结构：
- EN 是默认语言，无 locale 前缀（例如 `/blog/...`、`/guides/...`）
- 非 EN 语言带 locale 前缀（`/pt-BR/blog/...`, `/es-MX/blog/...`）

Platform 页面（`/platforms/*`）走非 locale 路由，需要在 metadata 中正确声明 hreflang，避免与 locale 路由的冲突。

---

## 二、推荐方案：统一 x-default 指向非 locale 版本

### 2.1 理由

- Platform 页面内容以英文为主，关键术语保留当地语言
- 暂无独立的 pt-BR/es-MX 本地化版本
- 统一 x-default 避免 hreflang 冲突和 404 风险

### 2.2 实现规范

**在 `/platforms/[platform]/[country]/page.tsx` 中：**

```typescript
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ platform: string; country: string }> }): Promise<Metadata> {
  const { platform, country } = await params
  const platformName = getPlatformName(platform)
  const countryName = getCountryName(country)
  const baseUrl = 'https://cosmetcheck.com'
  
  return {
    title: `${platformName} Cosmetics Requirements in ${countryName} | 2025 Seller Guide | CosmetCheck`,
    description: `Complete compliance guide for selling cosmetics on ${platformName} in ${countryName}. ANVISA/COFEPRIS requirements, prohibited products, and seller checklist.`,
    
    // 关键: Platform 页面使用非 locale URL 作为 canonical
    alternates: {
      canonical: `${baseUrl}/platforms/${platform}/${country}`,
      languages: {
        // EN: 非 locale 路径（默认语言）
        'en': `${baseUrl}/platforms/${platform}/${country}`,
        
        // 非 EN 语言: 指向非 locale 版本（因暂无本地化版本）
        'pt-BR': `${baseUrl}/platforms/${platform}/${country}`,
        'es-MX': `${baseUrl}/platforms/${platform}/${country}`,
        'zh-CN': `${baseUrl}/platforms/${platform}/${country}`,
        
        // x-default 指向非 locale 版本
        'x-default': `${baseUrl}/platforms/${platform}/${country}`,
      }
    }
  }
}
```

### 2.3 输出示例

对于 `/platforms/amazon/brazil`，生成的 `<head>` 应包含：

```html
<!-- canonical -->
<link rel="canonical" href="https://cosmetcheck.com/platforms/amazon/brazil" />

<!-- hreflang -->
<link rel="alternate" hreflang="en" href="https://cosmetcheck.com/platforms/amazon/brazil" />
<link rel="alternate" hreflang="pt-BR" href="https://cosmetcheck.com/platforms/amazon/brazil" />
<link rel="alternate" hreflang="es-MX" href="https://cosmetcheck.com/platforms/amazon/brazil" />
<link rel="alternate" hreflang="zh-CN" href="https://cosmetcheck.com/platforms/amazon/brazil" />
<link rel="alternate" hreflang="x-default" href="https://cosmetcheck.com/platforms/amazon/brazil" />
```

> **说明**: 所有语言版本都指向同一个 URL，这是有效的 hreflang 实现（Google 支持多个 hreflang 指向同一 URL）。

---

## 三、与 Blog 页面的 hreflang 对比

| 页面类型 | canonical | hreflang 行为 | x-default |
|----------|-----------|---------------|-----------|
| Blog （locale 路由） | `/en/blog/...` | 每个语言有独立 URL | `/en/blog/...` |
| Platform（非 locale 路由） | `/platforms/...` | 所有语言指向同一 URL | `/platforms/...` |
| Ingredient（非 locale 路由） | `/ingredient/...` | 所有语言指向同一 URL | `/ingredient/...` |

---

## 四、未来扩展（本地化时）

若未来为 Platform 页面添加 pt-BR/es-MX 本地化版本（例如 `/pt-BR/platforms/amazon/brazil`），hreflang 需要更新为：

```typescript
alternates: {
  canonical: `${baseUrl}/platforms/${platform}/${country}`,
  languages: {
    'en': `${baseUrl}/platforms/${platform}/${country}`,
    'pt-BR': `${baseUrl}/pt-BR/platforms/${platform}/${country}`,
    'es-MX': `${baseUrl}/es-MX/platforms/${platform}/${country}`,
    'zh-CN': `${baseUrl}/platforms/${platform}/${country}`,
    'x-default': `${baseUrl}/platforms/${platform}/${country}`,
  }
}
```

> **运营注意**: 当前阶段暂不需要本地化。若未来启动本地化，请提前 2 周通知运营，更新 SEO 策略。

---

## 五、验证清单

- [ ] 每个 Platform 页面有唯一的 canonical
- [ ] 每个 Platform 页面有完整的 hreflang 集（en + pt-BR + es-MX + zh-CN + x-default）
- [ ] 所有 hreflang 指向 200 OK 的 URL（无 404）
- [ ] canonical 与 x-default 一致
- [ ] 通过 Google Search Console 的 Hreflang 报告验证无错误
