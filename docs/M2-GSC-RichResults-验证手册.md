# M2 GSC 提交 + Rich Results 验证手册

> 本手册供运营团队按步骤执行，无需开发参与

---

## 一把手交付清单

| 项目 | 状态 | 说明 |
|------|------|------|
| sitemap.xml | ✅ 已部署 | `https://cosmetcheck.com/sitemap.xml` ，含 5 篇博客 + 4 个合规页面 + 多语言 alternates |
| robots.txt | ✅ 已部署 | `https://cosmetcheck.com/robots.txt` ，允许爬取所有公开页面 |
| Article Schema | ✅ 已验证 | 博客详情页包含 Article + BreadcrumbList |
| FAQPage Schema | ✅ 已验证 | 合规指南页包含 FAQPage + HowTo + BreadcrumbList |
| WebApplication Schema | ✅ 已验证 | 首页包含 WebApplication + AggregateRating |

---

## Step 1: Google Search Console 提交 sitemap

### 1.1 进入 GSC
打开 https://search.google.com/search-console

### 1.2 添加属性（如果尚未添加）
- 选择 **URL prefix** 方式
- 输入: `https://cosmetcheck.com/`
- 验证方式: 推荐使用 **DNS 记录验证** (最稳定，不会因为网站重构变化而失效)

### 1.3 提交 Sitemap
左侧导航 → **Sitemaps** → 输入:
```
sitemap.xml
```
点击 **Submit**

### 1.4 预期效果
- Google 通常需要 **1-7 天** 完成首次爬取
- sitemap 状态页面会显示 "Success" 或具体错误

---

## Step 2: Rich Results 验证

### 2.1 使用 Google 官方工具
打开 https://search.google.com/test/rich-results

### 2.2 逐个验证以下 URL

| # | 验证 URL | 期望检测到的 Schema |
|---|-----------|-------------------|
| 1 | `https://cosmetcheck.com/` | WebApplication, AggregateRating |
| 2 | `https://cosmetcheck.com/pt-BR/blog/anvisa-ingredientes-proibidos-2025` | Article |
| 3 | `https://cosmetcheck.com/pt-BR/compliance/brazil-anvisa` | FAQPage, HowTo |
| 4 | `https://cosmetcheck.com/es-MX/compliance/mexico-cofepris` | FAQPage |

### 2.3 验收标准
- 每个 URL 应该显示 **X 个有效结构化数据元素** (X ≥ 1)
- 没有 "必需字段缺失" 的错误
- Article 页面应该显示 "Article 丰富结果" 预览

---

## Step 3: 关键字排名监控（可选，建议第 2 周开始）

GSC 中可以监控以下目标关键字的排名变化:

| 关键字 | 目标页面 | 语言 |
|--------|----------|------|
| `anvisa lista de ingredientes proibidos cosmeticos` | /pt-BR/blog/anvisa-ingredientes-proibidos-2025 | PT-BR |
| `cofepris requisitos cosmeticos importados` | /es-MX/blog/cofepris-requisitos-cosmeticos | ES-MX |
| `cross-border compliance cosmetics` | /en/blog/anvisa-vs-fda-vs-eu | EN |

---

## Step 4: 外链建设启动（Week 12-14）

GSC 中 **Links** 报告可以监控外链增长。建议的初期外链渠道:

1. **目录提交**: 提交到巴西/墨西相关的商业目录
2. **社区发帖**: Mercado Livre/Shopee 卖家社区、Reddit r/beauty
3. **客座博客**: 联系拉美电商/跨境电商博客，提供合规指南类客座文章

---

## 常见问题排查

### Q: sitemap 提交后显示 "Couldn't fetch"?
检查 `https://cosmetcheck.com/sitemap.xml` 是否可以被公网访问：
```bash
curl -I https://cosmetcheck.com/sitemap.xml
```
如果返回 200，等待 24h 后重新提交。

### Q: Rich Results 测试显示 "Page is not eligible for rich results"?
可能原因:
1. Schema 代码格式有误 → 联系研发检查
2. 页面被 robots.txt 屏蔽 → 检查 robots.txt
3. Google 尚未完成首次爬取 → 等待 3-7 天

### Q: 多语言页面没有被正确索引?
检查 sitemap 中的 `<xhtml:link rel="alternate" hreflang="..." />` 标签是否正确。目前已验证正确配置。

---

*本手册修订日期: 2026-05-28 | M2 部署版本: cd2ab735*
