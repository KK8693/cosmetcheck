# Notion CMS 集成 - 配置指南

## 概述

CosmetCheck 博客系统现已支持 **Notion CMS** 作为内容源。运营团队可直接在 Notion 中编辑文章，构建时自动同步。

## 架构决策

| 维度 | 选择 |
|------|------|
| 同步策略 | **构建时静态生成** (SSG) |
| 回退机制 | Notion 未配置时自动使用本地 `blog-data.ts` |
| Edge 兼容 | ✅ `@notionhq/client` 纯 fetch 实现 |
| SEO | ✅ 静态 HTML，完美支持搜索引擎 |

## 快速开始

### 1. 创建 Notion Integration

1. 访问 [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. 点击 **New integration**
3. 填写名称：`CosmetCheck Blog CMS`
4. 选择关联的 Workspace
5. 复制 **Internal Integration Token**
6. 设置环境变量：`NOTION_TOKEN=<your-token>`

### 2. 创建 Blog Database

1. 在 Notion 中创建一个新 Database（Table view）
2. 按以下 schema 配置属性：

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| **Name** | Title | ✅ | 文章标题 |
| **Slug** | Rich text | ✅ | URL slug（如 `anvisa-ingredientes-2025`）|
| **Locale** | Select | ✅ | `pt-BR` / `es-MX` / `en` |
| **Category** | Select | ✅ | `Compliance` / `Dicas` / `Recursos` |
| **Excerpt** | Rich text | ✅ | 文章摘要 |
| **Published** | Checkbox | ✅ | 仅勾选的文章会发布 |
| **Featured** | Checkbox | ❌ | 是否精选 |
| **Tags** | Multi-select | ❌ | 标签列表 |
| **Target Keyword** | Rich text | ❌ | SEO 目标关键词 |
| **Reading Time** | Number | ❌ | 阅读时间（分钟）|
| **Date** | Date | ❌ | 发布日期 |
| **Content** | Page content | ✅ | 文章内容（blocks）|

3. 将 Database 页面 **Share** 给 Integration
4. 复制 Database ID（从 URL 中获取）
5. 设置环境变量：`NOTION_BLOG_DATABASE_ID=<database-id>`

### 3. 文章格式

在 Notion Page 中使用以下 block 类型撰写正文：

- **Heading 1/2/3** → `<h2>/<h3>/<h4>`
- **Paragraph** → `<p>`
- **Bulleted list** → `<ul><li>`
- **Numbered list** → `<ol><li>`
- **Quote** → `<blockquote>`
- **Divider** → `<hr>`
- **Image** → `<img>`（外部 URL 图片）
- **Toggle / Callout** → 暂不支持，会被跳过

### 4. 部署

设置环境变量后重新构建部署：

```bash
# 本地开发
export NOTION_TOKEN=secret_xxx
export NOTION_BLOG_DATABASE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
npm run build

# 生产部署（Cloudflare Pages）
# 在 Dashboard > Settings > Environment variables 中添加上述变量
# 然后触发重新部署
```

### 5. 更新内容流程

```
运营团队编辑 Notion → 触发重新构建部署 → 静态页面自动更新
```

**触发重新部署的方式：**
- Cloudflare Dashboard 手动触发
- Git commit + push（如果配置了 Git 集成）
- 调用 Cloudflare API 触发部署（可设置 Notion Webhook）

## 技术细节

### 文件结构

```
src/lib/notion.ts          # Notion API 客户端 + block-to-HTML 转换器
src/lib/blog-data.ts       # 数据源层（Notion → fallback 本地）
```

### 缓存策略

- `loadAllPosts()` 使用模块级缓存，单次构建只请求一次 Notion API
- 每页最多 100 条记录，自动分页

### 回退行为

| 场景 | 行为 |
|------|------|
| `NOTION_TOKEN` 未设置 | 使用本地 `blogPosts` 数据 |
| `NOTION_BLOG_DATABASE_ID` 未设置 | 使用本地 `blogPosts` 数据 |
| Notion API 请求失败 | 使用本地 `blogPosts` 数据 |
| Notion 无已发布文章 | 使用本地 `blogPosts` 数据 |

## 故障排查

### 构建时提示 "Failed to fetch from Notion"

检查：
1. `NOTION_TOKEN` 是否正确
2. Integration 是否已添加到 Database（Share → Add connections）
3. Database 中是否有 `Published = true` 的文章

### Notion block 未正确渲染

当前支持的 block 类型有限（见上文）。如需支持更多类型，修改 `src/lib/notion.ts` 中的 `blocksToHtml` 函数。

## 后续优化（M2b+）

- [ ] 增加 Notion Webhook → Cloudflare Pages 自动重新部署
- [ ] 增加 ISR（增量静态再生成）支持实时更新
- [ ] 增加 block 类型：table、code、embed、bookmark
- [ ] 增加文章 draft/preview 模式
