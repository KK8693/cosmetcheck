# CosmetCheck 技术任务书 — Phase 3: Ingredient 扩展 + 国家扩展

**优先级：** P1（下下月执行）  
**目标 URL 增量：** ~80 页  
**预计工时：** 1.5 周  
**分支：** 从 `main` 切出 `feat/ingredient-country-phase3`

---

## 一、任务概述

### Part A: Ingredient 精选扩展（54 → 120）

从 EU 化妆品法规、FDA 警告清单等权威来源精选 66 个新成分，聚焦于：
- **防腐剂** — 高搜索量、高商业价值
- **UV 过滤器** — 防晒市场热点
- **柔发/染发成分** — 电商平台高风险品类
- **白化/活性成分** — 功效性产品必备

### Part B: 轻量级国家扩展（4 个新市场）

新增 **Colombia、Argentina、Chile、Peru** 四国的法规概览页，不做完整的成分状态映射（数据缺失），但提供：
- 监管机构介绍
- 核心法规框架
- 注册/备案流程
- 标签要求
- 与 Brazil/Mexico 的对比
- 市场机会分析

---

## 二、URL 增量计算

| 类型 | 数量 | 说明 |
|-------|------|------|
| 新增 Ingredient 页 | 66 | 非 locale 路由 `/ingredient/[slug]` |
| 国家法规页 | 4 | `/regulation/colombia`, `/regulation/argentina`, 等 |
| 国家状态索引页 | 4 | `/status/[country]` 新增国家首页 |
| **小计** | **74** | |

加上内部链接更新、索引页扩展等，总计约 **80 URLs**。

---

## 三、Part A: Ingredient 扩展方案

### 3.1 数据来源优先级

| 优先级 | 来源 | 目标数量 | 理由 |
|-------|------|---------|------|
| P0 | EU Annex V (防腐剂) | 20 | 搜索量最高、电商常用 |
| P0 | EU Annex VI (UV 过滤器) | 15 | 防晒市场爆发 |
| P1 | EU Annex III (限用成分) | 20 | 浓度限制类 |
| P1 | FDA 色料清单 | 6 | 彩妆品必备 |
| P2 | ASEAN 指令 | 5 | 拉丁美洲共通市场 |

### 3.2 预选 66 个成分清单

**防腐剂类（20 个）**
```
phenoxyethanol, benzoic-acid, sodium-benzoate, potassium-sorbate,
ethylhexylglycerin, caprylyl-glycol, pentylene-glycol, ethylhexyglycerin,
dehyroacetic-acid, sodium-dehydroacetate, benzyl-alcohol,
chlorphenesin, sodium-salicylate, sorbic-acid, undecylenic-acid,
benzalkonium-chloride, cetrimonium-bromide, polyaminopropyl-biguanide,
isopropyl-phenols, thymol
```

**UV 过滤器类（15 个）**
```
oxybenzone, avobenzone, octocrylene, octisalate, homosalate,
tinosorb-s, tinosorb-m, uvasorb-heb, uvinul-a-plus, uvinul-t-150,
zinc-oxide, titanium-dioxide, ensulizole, meradimate, padimate-o
```

**柔/染发成分（12 个）**
```
4-aminophenol, 2-methylresorcinol, 4-chlororesorcinol,
m-aminophenol, o-aminophenol, toluene-25-diamine,
toluene-26-diamine, toluene-35-diamine, n-phenyl-p-phenylenediamine,
hc-blue-no-2, disperse-violet-1, acid-black-1
```

**白化/活性类（10 个）**
```
azelaic-acid, mandelic-acid, phytic-acid, tranexamic-acid,
ascorbic-acid, ascorbyl-glucoside, magnesium-ascorbyl-phosphate,
resorcinol, arbutin, deoxyarbutin
```

**其他高价值（9 个）**
```
talc, mineral-oil, petrolatum, lanolin, beeswax,
keratin, collagen, elastin, silk-protein
```

**总计：20 + 15 + 12 + 10 + 9 = 66**

### 3.3 数据格式规范

每个新成分必须包含：

```typescript
{
  slug: string           // URL-friendly ID
  name: string           // 常用名称（英文）
  inci: string           // INCI 名称
  cas: string            // CAS 号（尽量填写）
  category: string       // 引用 category-index.ts 中的分类
  commonUse: string      // 1-2 句话描述用途
  description: string    // 80-150 字符
  whyBanned?: string     // banned 成分必填
  whyRestricted?: string // restricted 成分必填
  healthRisks: string[]  // 3-5 条健康风险
  alternatives: string[] // 3 个替代成分 slug（必须已存在于 DB）
  status: {
    brazil: { status, regulation, since, limit?, note? }
    mexico: { status, regulation, since, limit?, note? } | null
  }
}
```

**数据准确性要求：**
- CAS 号必须验证（使用 PubChem 或 EU CosIng 数据库）
- 法规引用必须有具体条款编号（如 EU Reg. No 1223/2009, Annex V/XX）
- 浓度限制必须精确（如 "max 0.4% in leave-on products"）

### 3.4 实施步骤

**Step 1: 数据准备**
- 创建 `data-import/eu-ingredients-candidates.json`
- 使用脚本从 EU CosIng 数据库提取 66 个成分的元数据
- 验证 CAS 号并补充缺失字段

**Step 2: 内容生成**
- 使用模板化方法生成 description、healthRisks、alternatives
- 对于前 20 个高优先级成分，可使用 LLM 增强生成质量

**Step 3: 数据合并**
- 将 66 个新成分添加到 `ingredients-database.ts`
- 更新 `ingredients-priority.ts` 标记优先级
- 更新 `status-index.ts` 加入 brazil/mexico 索引

**Step 4: 验证**
- `npm run build` 无错误
- 所有 66 个新 ingredient 页面可访问
- 内部链接无 404

---

## 四、Part B: 国家扩展方案

### 4.1 四国法规概览

| 国家 | 监管机构 | 主要法规 | 市场规模 | 难度 |
|------|---------|---------|---------|------|
| **Colombia** | INVIMA | Decreto 677/1995, Resolución 3553/2014 | 中 | 低 |
| **Argentina** | ANMAT | Disposición ANMAT 1559/2004, 5268/2017 | 大 | 中 |
| **Chile** | ISP | Decreto 239/2002, Resolución 2393/2012 | 中 | 低 |
| **Peru** | DIGEMID | Decreto Supremo 007-2006-SA | 小 | 低 |

### 4.2 页面结构

每个国家的法规页面（参考现有 `/regulation/brazil`）：

```
/regulation/colombia     — Colombia INVIMA Cosmetics Regulation
/regulation/argentina    — Argentina ANMAT Cosmetics Regulation
/regulation/chile        — Chile ISP Cosmetics Regulation
/regulation/peru         — Peru DIGEMID Cosmetics Regulation
```

**每页必须包含的内容区块：**

1. **Hero 区**域：国家标识 + 监管机构 + 一句话概述
2. **Key Regulations**：核心法规列表（法规名称、年份、一句话说明）
3. **Cosmetics Definition**：该国如何定义"化妆品"，与"药品"的界限
4. **Registration Process**：注册/备案流程步骤
5. **Labeling Requirements**：标签强制要素
6. **Banned Categories**：明确禁止的产品类型或成分类别
7. **Import Process**：海关、检验检疫要求
8. **Market Comparison**：与 Brazil/Mexico 的对比表格
9. **Resources**：官方法规下载链接（如有）
10. **CTA**：引导使用 CosmetCheck 工具

### 4.3 数据准备要求

每个国家的法规信息必须基于官方来源：

- **Colombia**: INVIMA 官方网站 (invima.gov.co)
- **Argentina**: ANMAT 官方网站 (anmat.gob.ar)
- **Chile**: ISP 官方网站 (ispch.cl)
- **Peru**: DIGEMID 官方网站 (digemid.minsa.gob.pe)

**数据准确性要求：**
- 每个声明必须有官方来源引用
- 法规引用必须包含具体文件名称和年份
- 不确定的信息标注 "Information subject to verification with local authorities"
- 尽量使用英文写作，但保留西班牙语/葡萄牙语的法规原名

### 4.4 状态页面扩展

现有 `/status/[country]/[status]` 需要更新以支持新国家：

```typescript
// 更新 generateStaticParams
const countries = ['brazil', 'mexico', 'colombia', 'argentina', 'chile', 'peru']
```

但由于目前缺乏 Colombia/Argentina/Chile/Peru 的完整成分数据库，这些国家的状态页面只能展示：
- 该国法规概览
- 已知的禁用/限用成分类别（不列具具体成分）
- 链接到该国监管机构官方清单

---

## 五、交付物清单

### Part A: Ingredient 扩展

| # | 文件 | 说明 |
|---|------|------|
| 1 | `data-import/eu-ingredients-candidates.json` | EU 来源原始数据（脚本生成） |
| 2 | `scripts/generate-ingredient-content-v2.py` | 内容生成脚本 |
| 3 | `src/data/ingredients-database.ts` | 增量更新（+66 条） |
| 4 | `src/data/ingredients-priority.ts` | 更新优先级矩阵 |
| 5 | `src/data/status-index.ts` | 更新 brazil/mexico 状态索引 |

### Part B: 国家扩展

| # | 文件 | 说明 |
|---|------|------|
| 1 | `src/data/country-regulations.ts` | 四国法规数据模型 |
| 2 | `src/app/regulation/colombia/page.tsx` | Colombia 法规页 |
| 3 | `src/app/regulation/argentina/page.tsx` | Argentina 法规页 |
| 4 | `src/app/regulation/chile/page.tsx` | Chile 法规页 |
| 5 | `src/app/regulation/peru/page.tsx` | Peru 法规页 |
| 6 | `src/app/status/[country]/[status]/page.tsx` | 更新以支持新国家 |
| 7 | `src/app/sitemap.ts` | 更新以包含新页面 |

---

## 六、关键技术决策

### 6.1 为什么不做完整的成分状态映射？

Colombia/Argentina/Chile/Peru 的成分法规数据：
- 不完整：很少有系统化的禁用/限用清单数据库
- 难获取：官方清单多为 PDF，结构化程度低
- 维护成本高：法规频繁更新，需要持续跟踪
- **ROI 低**：这些国家的搜索量远低于 Brazil/Mexico

**替代方案**：
- 法规概览页提供足够的价值（监管框架、注册流程、标签要求）
- 补充"市场机会分析"区块，吸引想进入这些市场的卖家

### 6.2 为什么从 EU 法规引入成分＜而不是直接从新国家法规？

- EU 法规是全球化妆品法规的"金标准"，被多个国家参考
- EU CosIng 数据库提供完整的成分、CAS、限制条件
- 大多数跨境卖家的产品已经符合 EU 标准
- 添加 EU 成分可以帮助卖家了解"产品在欧洲是否合规"，扩展目标市场

---

## 七、测试 Checklist

### Part A: Ingredient 扩展

- [ ] `npm run build` 无 TypeScript 错误
- [ ] 所有 120 个 ingredient 页面可访问
- [ ] 新增 66 个页面包含正确的 canonical 和 hreflang
- [ ] 新增成分的 alternatives 引用的 slug 都存在
- [ ] 新增成分的 status 已加入 status-index.ts
- [ ] sitemap 包含所有新 ingredient URL

### Part B: 国家扩展

- [ ] `/regulation/colombia` 正常渲染
- [ ] `/regulation/argentina` 正常渲染
- [ ] `/regulation/chile` 正常渲染
- [ ] `/regulation/peru` 正常渲染
- [ ] 每页包含 Article Schema
- [ ] 每页包含 BreadcrumbList Schema
- [ ] 每页包含 FAQPage Schema（至少 3 条）
- [ ] 页面内容中的法规链接有效
- [ ] sitemap 包含所有新国家 URL

---

## 八、提交规范

```bash
git checkout -b feat/ingredient-country-phase3

# Part A 完成后提交：
git add .
git commit -m "feat(ingredients): expand database from 54 to 120 ingredients

- Add 66 new ingredients from EU Annex III/V/VI and FDA
- Focus on preservatives, UV filters, hair dyes, actives
- Update priority matrix and status index
- Verify all CAS numbers and regulatory references"

# Part B 完成后提交：
git add .
git commit -m "feat(regulations): add Colombia, Argentina, Chile, Peru guides

- Add 4 new country regulation overview pages
- Include INVIMA, ANMAT, ISP, DIGEMID frameworks
- Add market comparison with Brazil/Mexico
- Update status page routing for new countries"
```

---

## 九、注意事项

1. **数据准确性**：EU 成分数据必须从官方源（EU CosIng 数据库或 EUR-Lex）获取，不能从第三方网站复制。
2. **语言处理**：四国法规页面以英文为主，但必须保留西班牙语/葡萄牙语的法规原名（如 "Decreto 677/1995"）。
3. **市场分析**：四国法规页必须包含"市场机会"区块，用具体数据（市场规模、增长率、竞争程度）吸引卖家。
4. **不要**在四国法规页中声称"我们支持该国的完整成分检测"—目前数据不足，应诚实声明范围。
5. **图片**：四国法规页使用国家标志 emoji（🇨🇴 等），无需自定义图片。

---

**交付截止：下下月第二周周五前提交 PR，@CTO 审核后合并。**
