# CosmetCheck 技术待办项 (Technical TODO)

**更新日期：** 2025-05-16  
**来源：** CTO 审批 - SEO与性能优化技术方案

---

## 待处理任务

### SEO 优化

| ID | 任务 | 优先级 | 预估时间 | 状态 |
|----|------|--------|----------|------|
|| SEO-001 | 实现 sitemap.xml | P0 | 1h | ✅ 完成 |
| SEO-002 | 实现 robots.txt | P0 | 0.5h | ✅ 完成 |
| SEO-003 | 实现 JSON-LD Schema | P1 | 2h | ⏳ 待开始 |
| SEO-004 | 验证多语言 hreflang 配置 | P1 | 1h | ⏳ 待开始 |

### 性能优化

| ID | 任务 | 优先级 | 预估时间 | 状态 |
|----|------|--------|----------|------|
| PERF-001 | 改造图片组件为 next/image | P0 | 2-3h | ⏳ 待开始 |
| PERF-002 | 配置 CDN（可选） | P1 | 1h | ⏳ 待开始 |

---

## 实施顺序

1. **第一阶段 (P0)**：SEO 基础配置
   - [ ] SEO-001: sitemap.xml
   - [ ] SEO-002: robots.txt
   - [ ] PERF-001: next/image 改造

2. **第二阶段 (P1)**：SEO 增强 + 性能
   - [ ] SEO-003: JSON-LD Schema
   - [ ] SEO-004: hreflang 验证
   - [ ] PERF-002: CDN 配置

---

## 技术笔记

- sitemap 和 robots 使用 Next.js App Router 原生支持 (`src/app/sitemap.ts`, `src/app/robots.ts`)
- next/image 需要配置 `next.config.ts` 中的 images remotePatterns
- CDN 配置取决于部署平台：Vercel（自动）/ Cloudflare（免费）

---

*最后更新：2025-05-16*