# CosmetCheck Phase 2 运营执行计划

> **文档版本**: v1.0  
> **编制**: 运营与客户成功经理  
> **日期**: 2026-06-10  
> **分支**: `feat/platform-blog-phase2`  
> **目标**: 新增 ~128 URL，总计 ~400 URLs

---

## 一、任务全景图

| 模块 | 新增 URL | 技术复杂度 | 内容复杂度 | 风险等级 |
|------|----------|-----------|-----------|----------|
| Part A: Platform 合规页 | 53 | 中 | 高（数据准确性） | 中 |
| Part B: Blog 集群 | ~75 | 低 | 高（20 篇×3 语=60 篇） | 低 |
| SEO/Schema/Sitemap | — | 低 | 中 | 低 |
| **合计** | **~128** | — | — | — |

---

## 二、Part A: Platform 页面 — 运营策略

### 2.1 页面层级与流量漏斗定位

```
Top of Funnel (认知)
  └─ /platforms                    ← 索引页，聚合流量入口
  └─ /platforms/compare            ← 对比页，高分享价值

Middle of Funnel (考虑)
  └─ /platforms/[platform]         ← 平台概览（Amazon/Mercado Livre/Shopee）
  └─ /platforms/[platform]/[country]  ← 国家详情（Brazil/Mexico）

Bottom of Funnel (转化)
  └─ /platforms/[platform]/[country]/[category]  ← 品类合规页
```

### 2.2 内容策略: 数据准确性 SOP

**核心原则**: 所有平台政策声明必须有可追溯的官方来源。

| 数据点 | 来源要求 | 不确定时的处理方式 |
|--------|----------|-------------------|
| 卖家注册要求 | 平台官方 Seller Center | 标注 "Based on [platform] seller policies as of [date]. Verify on official site." |
| 费用结构 | 平台官方定价页 | 引用官方链接，注明货币和时效 |
| 化妆品政策 | 平台 Help Center / 卖家政策 | 引用具体政策文档 URL |
| 禁售品类 | 平台 Restricted Products 政策 | 交叉引用当地法规（ANVISA/COFEPRIS） |
| ANVISA/COFEPRIS 要求 | 现有 `/regulation/*` 页面 | 保持与现有法规页面 100% 一致 |

**数据审查 Checklist**（每平台×国家组合必须通过）：
- [ ] 平台官方卖家政策链接已验证（200 OK）
- [ ] 法规引用与现有 `/regulation/brazil` 和 `/regulation/mexico` 一致
- [ ] 禁售/限制品类列表有官方来源支撑
- [ ] PTR/COFEPRIS 注册要求表述准确
- [ ] 所有外部链接附带 `rel="nofollow noopener"`
- [ ] 页面底部包含免责声明："Information current as of [date]. Always verify with official platform policies."

### 2.3 SEO Schema 规范（每页必含）

| Schema 类型 | 优先级 | 用途 |
|-------------|--------|------|
| FAQPage | P0 | 捕获 People Also Ask |
| BreadcrumbList | P0 | 站内导航 + 富媒体结果 |
| Organization | P1 | 平台品牌信息 |
| HowTo | P1 | 卖家注册流程（仅 platform/country 页） |
| WebPage | P1 | 基础页面结构化 |

### 2.4 内部链接网规划

每页必须包含的交叉链接：

```
/platforms/[platform]/[country]/[category]
  ├─ → /regulation/[country]           (法规上下文)
  ├─ → /category/[category]            (品类成分列表)
  ├─ → /ingredients                    (成分数据库)
  ├─ → /status/[country]/banned        (禁用成分状态)
  ├─ → /blog/* (相关文章)               (教育内容)
  └─ → /platforms/compare              (对比其他平台)
```

**目标**: 每个 Platform 页面至少 5 个内部出站链接，形成内容集群。

---

## 三、Part B: Blog 集群 — 内容策略

### 3.1 内容日历（5 周发布节奏）

| 周次 | 主题组 | 文章数 | 目标发布日 | KPI |
|------|--------|--------|-----------|-----|
| Week 1 | 组 1: 注册与合规实操 | 5 | Mon-Fri | 索引率 >80% |
| Week 2 | 组 2: 成分与安全 | 5 | Mon-Fri | 平均阅读时长 >3min |
| Week 3 | 组 3: 平台运营 | 5 | Mon-Fri | 内部链接 CTR >5% |
| Week 4 | 组 4: 市场趋势与深度 | 5 | Mon-Fri | 社交分享 >10/篇 |
| Week 5 | 缓冲 + QA + 补漏 | — | — | 全部通过 Checklist |

**详细文章清单见**: [PHASE2_CONTENT_CALENDAR.md](./PHASE2_CONTENT_CALENDAR.md)

### 3.2 关键词策略（TOFU → MOFU → BOFU）

| 漏斗阶段 | 文章示例 | Target Keyword | 月搜索量预估 | 难度 |
|----------|----------|---------------|-------------|------|
| TOFU | latam-cosmetics-market-size-2025 | "latin america cosmetics market size 2025" | 500-1K | 低 |
| TOFU | eu-cosmetics-regulation-vs-latam | "EU vs LATAM cosmetics regulation" | 200-500 | 低 |
| MOFU | anvisa-registration-process-2025 | "ANVISA registration process" | 1K-2K | 中 |
| MOFU | amazon-brazil-seller-guide-cosmetics | "sell cosmetics amazon brazil" | 500-1K | 中 |
| BOFU | anvisa-cofepris-comparison-2025 | "ANVISA vs COFEPRIS cosmetics" | 300-500 | 中 |
| BOFU | top-10-banned-ingredients-brazil-2025 | "banned cosmetic ingredients brazil" | 1K-2K | 低 |

**完整关键词映射见**: [PHASE2_KEYWORD_MAP.md](./PHASE2_KEYWORD_MAP.md)

### 3.3 多语言本地化要求

| 语言 | 关键术语规范 | 目标市场 | 关键词示例 |
|------|-------------|----------|-----------|
| en | ANVISA, COFEPRIS, PTR, NOM-141 | 全球/北美卖家 | "ANVISA registration" |
| pt-BR | registro ANVISA, Responsável Técnico, RDC 665/2022 | 巴西本土 + 葡语非洲 | "registro ANVISA cosméticos" |
| es-MX | registro COFEPRIS, NOM-141-SSA1, Aviso de Responsabilidad | 墨西哥 + 拉美 | "registro COFEPRIS cosméticos" |

**翻译质量控制**: 
- 使用术语表（Glossary）确保一致性
- 关键法规编号不可翻译（RDC 665/2022, NOM-141-SSA1/SCF1-2012）
- 数据点（数字、百分比、日期）必须保留原文

### 3.4 内容质量标准（每篇文章必须通过）

- [ ] 标题含 target keyword，≤ 60 字符
- [ ] Meta description 150-160 字符，含主要关键词
- [ ] 正文 2000-3000 词，H2/H3 结构清晰
- [ ] 至少 3 个内部链接（指向 ingredient / regulation / product type / platform 页）
- [ ] 至少 1 个 CTA（引导使用 CosmetCheck 工具）
- [ ] 文末 3-5 条 FAQ（用于 FAQPage Schema）
- [ ] Article Schema 完整（author, datePublished, dateModified）
- [ ] 无 AI 套话，每篇有具体法规引用或数据点

---

## 四、分批上线计划（防 SEO 冲击）

### 4.1 为什么分批？

一次性上线 128 个新 URL 可能触发：
- Google 抓取预算突然耗尽，老页面索引延迟
- 新页面被标记为 "低质量"（如果内容尚未被充分评估）
- 站点地图体积突增，解析延迟

### 4.2 分批策略（5 批次，每批 ≤36 URL）

> **CTO 审批调整**: 原 Batch 3（72 URL）拆分为 Batch 3/4/5，降低集中上线风险。每批间隔 ≥7 天，GSC 提交保持 5-10 个/天。

| 批次 | 内容 | URL 数 | 上线日 | GSC 提交策略 |
|------|------|--------|--------|-------------|
| Batch 1 | Platform 基础设施（索引+对比+3 平台概览） | 5 | Day 1 | 立即提交 5 个高优先级 URL |
| Batch 2 | Platform×Country（6 页）+ Blog 组 1（5 篇×3 语=15 URL） | 21 | Day 8 | 每天提交 5 个，4 天完成 |
| Batch 3 | Platform×Country×Category 前半（21 URL）+ Blog 组 2（5 篇×3 语=15 URL） | 36 | Day 15 | 每天提交 7-10 个，4 天完成 |
| Batch 4 | Platform×Country×Category 后半（21 URL）+ Blog 组 3（5 篇×3 语=15 URL） | 36 | Day 22 | 每天提交 7-10 个，4 天完成 |
| Batch 5 | Blog 组 4（5 篇×3 语=15 URL）+ 补漏 + GSC 复查 | 15 | Day 29 | 每天提交 5 个，3 天完成 |

**总周期**: ~5 周（从代码合并到全部 GSC 提交完毕）

### 4.3 GSC 提交优先级（每批次内）

### 4.3 GSC 提交优先级（每批次内）

```
P0 (首日提交):
  - /platforms
  - /platforms/compare
  - /platforms/amazon/brazil
  - /platforms/amazon/mexico
  - Blog: anvisa-registration-process-2025 (en/pt/es)

P1 (次日提交):
  - 剩余 platform/country 组合
  - Blog: cofepris-registration-timeline (en/pt/es)

P2 (第 3-5 天提交):
  - platform/country/category 组合（按批）
  - 剩余 blog 文章
```

> **分批要求**: Batch 3/4/5 间隔 ≥7 天，每天 GSC 提交 5-10 个，避免一次性大量提交。

---

## 五、上线后监控 KPI

### 5.1 技术监控（上线后 7 天）

| 指标 | 目标 | 检查频率 | 责任人 |
|------|------|----------|--------|
| 新页面 200 率 | 100% | 每日 | 开发团队 |
| 404 错误 | 0 | 每日 | 开发团队 |
| 核心 Web Vitals (LCP/CLS) | Pass | 每周 | 开发团队 |
| Sitemap 解析状态 | Success | 每周 | 运营 |

### 5.2 SEO 监控（上线后 30 天）

| 指标 | 目标 | 检查频率 | 责任人 |
|------|------|----------|--------|
| 新 URL 索引率 | >70% | 每周 | 运营 |
| 平均排名（target keywords） | Top 50 | 每周 | 运营 |
| 自然流量增长 | +20% vs 基线 | 每月 | 运营 |
| 内部链接点击率 | >3% | 每月 | 运营 |
| 跳出率（blog） | <60% | 每月 | 运营 |

### 5.3 内容效果监控（上线后 60 天）

| 指标 | 目标 | 检查频率 |
|------|------|----------|
| Blog 文章平均阅读时长 | >3 分钟 | 每月 |
| CTA 点击率（"Try CosmetCheck"） | >2% | 每月 |
| 社交分享数 | >10/篇 | 每月 |
| 反向链接获取（blog） | >2/篇 | 每季度 |

---

## 六、风险预案

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|----------|
| 平台政策信息过时 | 高 | 中 | 每季度审查一次，页面标注最后更新日期 |
| Google 对新批量内容降权 | 低 | 高 | 严格分批上线，确保每批内容质量达标 |
| 翻译质量不达标 | 中 | 中 | 建立术语表，关键文章人工校对 |
| 内部链接断裂 | 中 | 低 | 上线前运行链接检查脚本 |
| 构建时间超时 | 中 | 中 | 静态生成优化，必要时启用 ISR |

---

## 七、交付物清单

| 交付物 | 位置 | 状态 |
|--------|------|------|
| 运营执行计划（本文档） | `docs/PHASE2_OPS_PLAN.md` | ✅ |
| 内容日历 | `docs/PHASE2_CONTENT_CALENDAR.md` | ⏳ |
| 关键词映射 | `docs/PHASE2_KEYWORD_MAP.md` | ⏳ |
| Platform 数据 SOP | `docs/PHASE2_PLATFORM_DATA_SOP.md` | ⏳ |
| GSC 提交队列更新 | `docs/gsc-indexing-queue.md`（追加） | ⏳ |
| 术语表（Glossary） | `docs/PHASE2_GLOSSARY.md` | ⏳ |

---

## 八、审批流程

1. **运营计划审批**: 本文档 → @CTO 审批
2. **内容日历审批**: PHASE2_CONTENT_CALENDAR.md → @CTO 审批
3. **关键词映射审批**: PHASE2_KEYWORD_MAP.md → @CTO 审批
4. **数据 SOP 审批**: PHASE2_PLATFORM_DATA_SOP.md → @CTO 审批
5. **开发启动**: 全部审批通过 → 开发团队执行

---

**下一步**: 等待 CTO 审批后，进入内容生产阶段。
