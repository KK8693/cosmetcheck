# CosmetCheck Landing Page 修改方案文档

> **项目**：CosmetCheck — 拉美美妆合规检测 + AI Listing 生成工具  
> **技术栈**：Next.js 15 + Tailwind CSS + shadcn/ui + Cloudflare Pages  
> **目标**：提升首屏信任感、CTA 点击率、定价页转化率、整体移动端体验  
> **交付**：可直接执行的文案/组件/颜色/布局级 PRD

---

## P0 — 立即做（本周内上线）

---

### P0-1 首屏信任背书重构（Social Proof 区块）

**现状问题**：Hero 区仅有文字 badge `已服务 2,000+ 拉美美妆卖家`，无视觉信任元素。

**修改内容**：

在 Hero `h1` 与 Demo 卡片之间，插入一个 **SocialProofBar** 组件。布局上位于 `h1` 下方、`p` 描述下方，紧贴 Demo 卡片上方。

#### 1.1 数据化结果徽章（替换原有 badge）
- **文案**：`已服务 2,000+ 卖家 · 拦截 340,000+ 次合规风险 · 覆盖巴西/墨西哥/哥伦比亚`
- **视觉**：
  - 背景 `bg-white/10 backdrop-blur rounded-full px-5 py-2`
  - 左侧保留绿色脉冲点 `animate-pulse bg-green-400`
  - 三个数据段用 `·` 分隔，字号 `text-sm font-medium text-white/95`
  - 数字部分加粗 `font-bold text-white`

#### 1.2 平台 Logo 墙
- **位置**：SocialProofBar 下方，与 Demo 卡片间隔 `mb-6`
- **文案前缀**：`被这些平台的卖家信赖`
- **视觉**：
  - 字号 `text-xs text-white/50 uppercase tracking-wider mb-3`
  - Logo 行使用 `flex justify-center items-center gap-6 flex-wrap opacity-60 grayscale hover:grayscale-0 transition-all duration-500`
  - **Logo 列表**（文字占位，先用灰色文字/图标代替，设计图到达后替换为 SVG）：
    - `Amazon Brazil`（文字 + 灰色边框 rounded-lg px-3 py-1）
    - `Mercado Livre`
    - `Shopee BR/MX`
    - `TikTok Shop`
    - `SHEIN`
  - **实现**：用纯 CSS/Tailwind 文字 Logo + `border border-white/10 rounded-md px-3 py-1.5 text-xs text-white/70 font-medium`，保证无外链图片也能先上线。

#### 1.3 真实案例短卡（悬浮感）
- **位置**：Logo 墙下方，与 Demo 卡片间隔 `mb-4`
- **内容**：横向 3 张小卡片，宽度自适应，最大 `max-w-2xl mx-auto`
- **卡片样式**：
  - `bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10`
  - 内部结构：
    - 顶部：`🚫 被拦截的风险案例` 红色微标
    - 中部：具体文案（小号 `text-xs`）
    - 底部：结果数据（绿色 `text-green-400 font-bold`）
- **三张卡片具体文案**：

| 卡片 | 顶部标签 | 正文 | 结果数据 |
|---|---|---|---|
| A | `❌ 禁用成分` | `"某美白霜含 Hydroquinone 2%，直接被 ANVISA 标红"` | `→ 修改后 48h 重新上架` |
| B | `⚠️ 标签违规` | `"防晒产品未标注 SPF 值，墨西哥海关扣留"` | `→ AI 生成合规标签，0 罚款` |
| C | `📝 文案误触` | `"抗皱文案写错 1 个词，Listing 被下架 7 天"` | `→ 替换后 CTR 提升 23%` |

**组件新增**：`src/components/SocialProofBar.tsx`

**验收标准**：
- [ ] Hero 区可见 3 组信任元素（数据徽章 + Logo 墙 + 案例卡）
- [ ] Logo 墙在手机端自动换行，不溢出屏幕
- [ ] 案例卡在手机端垂直堆叠（`grid-cols-1 md:grid-cols-3`）
- [ ] 所有新增元素适配深色/渐变背景，文字对比度 ≥ 4.5:1

**预期影响**：首屏信任度显著提升，预估 Demo 试用率 +15%~25%。

---

### P0-2 CTA 按钮体系重构（紧迫感 + 价值强调）

**现状问题**：
- Pricing Free 卡按钮文案 `免费开始` — 无差异化
- Footer CTA `免费检测我的产品` — 缺乏时效/价值锚定
- 无统一主 CTA 色彩层级

**修改内容**：

#### 2.1 统一 CTA 文案矩阵

| 位置 | 原文案 | 新文案 | 说明 |
|---|---|---|---|
| Hero Demo 主按钮 | `AI生成Listing` | `🚀 免费生成 Listing` | 加 emoji 降低门槛感 |
| Hero Demo 次按钮 | `检测合规` | `先检测合规` | 弱化次按钮，引导主路径 |
| Pricing Free 卡 | `免费开始` | `免费试用 10 次` | 明确价值量 |
| Pricing Pro 卡 | `升级 Pro` | `¥199 解锁无限次` | 用人民币锚定（若 Stripe 支持）或保留 `$29`，但在中文语境下建议显示 `≈¥199/月` |
| Footer CTA | `免费检测我的产品` | `立即免费检测 — 限时无需信用卡` | 紧迫感 + 零风险 |

#### 2.2 CTA 视觉层级（颜色/大小/动效）

**主 CTA 样式（用于 Hero AI生成Listing + Pricing Pro）**：
```
className="relative overflow-hidden bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-[#1f2937] 
           hover:from-[#f59e0b] hover:to-[#d97706] font-bold text-base md:text-lg 
           h-12 md:h-14 px-8 rounded-xl shadow-lg shadow-amber-500/30 
           hover:shadow-xl hover:shadow-amber-500/40 hover:-translate-y-0.5 
           transition-all duration-300 animate-pulse-subtle"
```
- **新增 CSS**：在 `globals.css` 增加自定义动画
```css
@keyframes pulse-subtle {
  0%, 100% { box-shadow: 0 10px 25px -5px rgba(251, 191, 36, 0.3); }
  50% { box-shadow: 0 15px 35px -5px rgba(251, 191, 36, 0.5); }
}
.animate-pulse-subtle {
  animation: pulse-subtle 3s ease-in-out infinite;
}
```
- **理由**：金色/琥珀色在紫色渐变背景上对比最强，且「限时/免费」类 CTA 在 SaaS 中普遍使用暖色。

**次 CTA 样式（用于 Hero 检测合规 + Pricing Free）**：
```
className="bg-white text-[#7c3aed] hover:bg-white/95 font-semibold h-12 px-6 rounded-xl 
           border-2 border-white/80 hover:border-white transition-all"
```

**Footer CTA 按钮**：
- 同样使用主 CTA 金色样式
- 在其上方增加一个 **微标 urgency badge**：`限时福利 · 本月注册送 5 次 Pro 体验`
- Badge 样式：`bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-bounce mb-3 inline-block`

#### 2.3 Pricing Pro 卡价格展示优化
- 在 `$29/月` 上方增加原价删除线：`原价 $49/月`（灰色删除线 `text-gray-400 line-through text-sm`）
- 在价格下方增加一行小字：`折合约 ¥199/月 · 随时取消`
- 在 Pro 卡底部增加一行红色强调：`一次 ANVISA 罚款 = 17 个月 Pro 费用`

**验收标准**：
- [ ] 全站 CTA 文案按上表替换，无遗漏
- [ ] 主 CTA 按钮使用琥珀色渐变 + 微妙光晕动画
- [ ] Pricing Pro 卡展示原价锚定 + 罚款对比文案
- [ ] Footer CTA 区域有红色限时 badge

**预期影响**：CTA 点击率预估 +20%~30%，Pricing 页转化率 +10%~15%。

---

### P0-3 功能展示具象化（"会不会被下架" 导向 + 实时演示区）

**现状问题**：Features 区描述为 `ANVISA+COFEPRIS双引擎`，抽象技术语言；Hero Demo 虽存在但缺乏「结果可视化」冲击力。

**修改内容**：

#### 3.1 Features 文案重构（从功能语言 → 结果语言）

| 原 Icon | 原标题 | 原标题 | 新标题 | 新描述 |
|---|---|---|---|---|
| 🛡️ | ANVISA+COFEPRIS双引擎 | 同时覆盖巴西和墨西哥法规，一键切换检测目标市场 | **上架前自动拦截下架风险** | 输入成分秒出风险报告：哪里违规、怎么改、参考哪条法规 — 不让罚款单先到 |
| 🌐 | 葡/西双语AI生成 | 基于当地消费者习惯生成Listing，非直译 | **当地人看了就想买的 Listing** | 不是翻译，是按巴西/墨西哥消费者搜索习惯重写标题和卖点，自带合规过滤 |
| ⚡ | 实时违禁词检测 | 毫秒级检测，违禁成分实时标红，附法规来源 | **违禁词秒标红，附官方条款** | ANVISA RDC 编号、COFEPRIS NOM 标准直接引用，平台申诉有依据 |
| 🎁 | 免费开始 | 每月10次免费检测，先体验再付费 | **0 元先测 10 次，再决定付不付费** | 不用绑卡、不用签合同，测完觉得有用再升级 |

#### 3.2 新增「实时演示区」（Interactive Demo 区块）
- **位置**：Features 区之后、Pricing 区之前
- **区块标题**：`30 秒看懂：你的产品会不会被下架`
- **副标题**：`输入一个真实成分，看 AI 如何 3 步拦截风险 → 生成合规 Listing`
- **布局**：左右分栏（`grid lg:grid-cols-2 gap-8`），左侧为交互输入区，右侧为结果预览区
- **左侧输入区**：
  - 预设一个真实案例：`输入成分：Aqua, Glycerin, Niacinamide, Hydroquinone, Parfum`
  - 国家选择：巴西 ANVISA（默认选中）
  - 一个显眼的琥珀色按钮：`运行检测演示`
  - 说明文字：`👆 点击按钮，模拟真实检测流程（无需注册，不消耗次数）`
- **右侧结果区**（默认展示静态预览，点击后展示动画）：
  - 步骤 1 动画：`扫描成分...` → 标红 `Hydroquinone`
  - 步骤 2 结果：`❌ 不合规 — ANVISA RDC 15/2013 禁止 Hydroquinone 用于美白产品`
  - 步骤 3 行动：`AI 自动替换为合规成分并生成新 Listing`
  - 最终结果卡片：展示一个修正后的标题 + 合规说明
- **视觉**：
  - 背景 `bg-gray-50 rounded-3xl p-8 md:p-12`
  - 结果区用 Mac 窗口样式装饰（`rounded-xl border border-gray-200 shadow-xl bg-white overflow-hidden`）
  - 窗口顶部三个圆点 `bg-red-400 bg-yellow-400 bg-green-400`
  - 内部用等宽字体 `font-mono text-sm` 模拟终端/检测日志输出效果

**组件新增**：`src/components/InteractiveDemo.tsx`

**验收标准**：
- [ ] Features 区 4 张卡片文案按上表替换
- [ ] 新增 InteractiveDemo 区块位于 Features 与 Pricing 之间
- [ ] 演示区有「点击 → 动画 → 结果」的完整交互闭环
- [ ] 演示区在移动端垂直堆叠，左右分栏在 `lg` 断点触发
- [ ] 动画时长控制在 3~5 秒，可重复播放

**预期影响**：用户理解成本降低，Features 到 Pricing 的滚动转化率 +15%~20%。

---

## P1 — 本周内（P0 上线后紧接着）

---

### P1-4 定价页对比冲击力升级

**现状问题**：Free vs Pro 差异不清晰，缺原价锚定、缺罚款案例。

**修改内容**：

#### 4.1 定价卡片视觉重构

**Free 卡**：
- 顶部标签：`入门试用`（灰色 `bg-gray-100 text-gray-600`）
- 价格区：`$0` 大字，`/月` 灰色
- 在价格下方加一行：`适合：每月 ≤10 个 SKU 的测试卖家`
- Feature 列表前 3 条保留，后 2 条增加 ❌ 标记（暗示 Pro 才有）
  - `❌ AI Listing 生成`（灰色划线）
  - `❌ 批量 CSV 检测`（灰色划线）

**Pro 卡**（视觉加重）：
- 顶部标签改为：`最划算 — 卖家首选`（原 `推荐` 太弱）
- 背景增加微弱渐变：`bg-gradient-to-b from-[#7c3aed]/5 to-white`
- 价格区：
  ```
  <span className="text-gray-400 line-through text-lg mr-2">$49</span>
  <span className="text-5xl font-extrabold text-gray-900">$29</span>
  <span className="text-gray-500 ml-1">/月</span>
  ```
- 价格下方增加红色对比条：
  ```
  <div className="mt-3 rounded-lg bg-red-50 border border-red-100 p-3">
    <p className="text-red-700 text-sm font-medium">
      ⚠️ ANVISA 单次违规罚款 ≈ R$ 10,000（≈ $1,700），够付 <span className="font-bold">58 个月</span> Pro
    </p>
  </div>
  ```
- Feature 列表全部 ✅，并在最后增加 2 条高价值项（金色图标）：
  - `🌟 新市场优先体验（阿根廷/哥伦比亚 Q3 上线）`
  - `🌟 专属合规顾问 1v1（年度订阅）`

#### 4.2 定价页新增「客户省钱案例」栏
- **位置**：Pricing 卡片下方，FAQ 上方
- **标题**：`Pro 用户平均每月避免多少损失？`
- **3 列数据卡**：

| 卡 A | 卡 B | 卡 C |
|---|---|---|
| `R$ 8,500` | `7 天` | `92%` |
| `平均避免罚款金额` | `平均节省合规时间` | `Listing 审核通过率` |
| `基于 200+ 卖家调研` | `从 2 周缩短到 3 天` | `AI 生成 vs 人工撰写` |

- **视觉**：`grid md:grid-cols-3 gap-6`，卡片 `bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm`
- 数字用 `text-4xl font-extrabold text-[#7c3aed]`，说明文字 `text-sm text-gray-500`

**验收标准**：
- [ ] Free 卡展示 2 条灰色划线功能项
- [ ] Pro 卡展示原价删除线 + 红色罚款对比条
- [ ] 定价页新增「客户省钱案例」3 列数据
- [ ] 移动端卡片垂直堆叠，Pro 卡始终在最上方（视觉优先级）

**预期影响**：定价页转化意愿 +15%~25%，Pro 升级率提升。

---

### P1-5 FAQ 交互与视觉优化

**现状问题**：FAQ 虽可折叠，但动画生硬（无 height transition），默认全收，视觉上仍像「堆砌」。

**修改内容**：

#### 5.1 动画升级
- 使用 CSS Grid trick 实现平滑 height transition：
```css
.faq-content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.35s ease-out;
}
.faq-content.open {
  grid-template-rows: 1fr;
}
.faq-content-inner {
  overflow: hidden;
}
```
- 展开时 `+` 图标旋转为 `×`（`rotate-45` 改为 `rotate-45` 并配合 `transition-transform duration-300`）
- 问题文字展开时保持 `font-semibold`，收拢时恢复 `font-medium`

#### 5.2 默认展开策略
- 默认展开第 1 条（`activeFaq = 0`），其余收起。降低「堆砌感」。

#### 5.3 视觉分组
- 在 8 条 FAQ 之间增加视觉分组标题：
  - 第 1~3 条上方加小标题 `关于检测准确性`
  - 第 4~5 条上方加小标题 `关于 Listing 与平台`
  - 第 6~8 条上方加小标题 `关于账户与付费`
- 小标题样式：`text-xs font-bold text-[#7c3aed] uppercase tracking-wider mt-6 mb-3`

#### 5.4 底部增加「没找到答案？」行动条
- **位置**：FAQ 列表最下方
- **内容**：
  ```
  <div className="mt-8 rounded-2xl bg-[#7c3aed]/5 border border-[#7c3aed]/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
    <div>
      <p className="font-semibold text-gray-900">还有疑问？</p>
      <p className="text-sm text-gray-500">WhatsApp 上回复通常在 10 分钟内</p>
    </div>
    <a href="https://wa.me/xxx" target="_blank" rel="noopener noreferrer"
       className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors">
      💬 WhatsApp 咨询
    </a>
  </div>
  ```

**验收标准**：
- [ ] FAQ 展开/收起有平滑动画（肉眼可见过渡，非瞬间闪现）
- [ ] 默认展开第 1 条
- [ ] 8 条 FAQ 分为 3 组，带分组小标题
- [ ] 底部有 WhatsApp 咨询行动条
- [ ] 移动端手势友好，点击区域 ≥ 48px

**预期影响**：FAQ 区域停留时长增加，跳出率降低，信任度提升。

---

### P1-6 底部新增「联系我们」+ WhatsApp 快速咨询

**现状问题**：Footer 仅有常规链接列，无即时沟通入口。拉美用户习惯 WhatsApp。

**修改内容**：

#### 6.1 Footer 重构为 5 列布局（桌面端）
- 第 1 列：`CosmetCheck` 品牌 + 一句话简介（保留）
- 第 2 列：`产品`（保留）
- 第 3 列：`资源`（保留）
- 第 4 列：`法律`（保留）
- **新增第 5 列**：`联系我们`
  - `📧 support@cosmetcheck.com`
  - `💬 WhatsApp: +55 11 99999-9999`（先写占位号，运营后替换）
  - `🕐 客服时间：巴西时间 9:00–18:00 (GMT-3)`
  - 样式：链接文字 `text-sm text-gray-400 hover:text-white transition-colors`

#### 6.2 全局悬浮 WhatsApp 按钮（Fixed FAB）
- **位置**：右下角 `fixed bottom-6 right-6 z-50`
- **样式**：
  ```
  <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer"
     className="flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 
                text-white rounded-full shadow-lg shadow-green-500/30 hover:shadow-xl 
                hover:scale-110 transition-all duration-300">
    <svg ...WhatsApp icon... className="w-7 h-7" />
  </a>
  ```
- **动效**：页面加载 3 秒后，按钮执行一次 `animate-bounce`（持续 1 秒），吸引注意
- **Tooltip**：鼠标悬停时显示 `WhatsApp 快速咨询`（`absolute bottom-full right-0 mb-2 ...`）

#### 6.3 Footer CTA 区邮箱输入框增加反馈
- 当前 Footer CTA 的邮箱输入框 + 按钮无实际功能绑定
- **修改**：点击按钮时，若邮箱格式合法，显示成功提示：`🎉 已发送 — 请查收邮件开启免费检测`
- 提示样式：`mt-3 text-sm text-green-400 font-medium animate-fade-in`

**验收标准**：
- [ ] Footer 为 5 列布局（`grid-cols-2 md:grid-cols-5`）
- [ ] 全局右下角有绿色 WhatsApp FAB，带一次弹跳动画
- [ ] FAB 在移动端不遮挡主要内容（`bottom-20` 若底部有导航条，否则 `bottom-6`）
- [ ] Footer CTA 邮箱提交后有视觉反馈（即使只是前端模拟）

**预期影响**：用户咨询转化率 +20%~30%，客户获取成本降低。

---

## P2 — 优化（排期灵活）

---

### P2-7 移动端体验专项适配

**现状问题**：核心用户可能手机操作，但页面在移动端可能有横向溢出、按钮过小、Demo 区输入困难等问题。

**修改内容**：

#### 7.1 Hero 区移动端适配
- **标题**：`text-4xl font-extrabold` → 在 `sm` 以下改为 `text-3xl leading-tight`，避免长标题换行 4 行以上
- **SocialProofBar 案例卡**：`grid-cols-1` 垂直堆叠，避免横向挤压
- **Demo 卡片**：
  - `max-w-xl` 在移动端改为 `max-w-full`
  - 内部输入框增加 `text-base`（防止 iOS 缩放页面）
  - 两个按钮垂直堆叠（`flex-col`）且宽度 `w-full`
  - 国家选择按钮增加 `min-h-[44px]`

#### 7.2 Pricing 卡片移动端
- 卡片垂直堆叠时，Pro 卡必须排在第一位（`order-first md:order-none`）
- 价格字号缩小为 `text-3xl`（`md:text-5xl`）
- Feature 列表行高增加 `leading-loose`，便于手指浏览

#### 7.3 FAQ 移动端
- 问题文字 `text-base`（`md:text-lg`），确保可读性
- 点击区域 padding 增加 `py-5`（`md:py-6`）
- 展开后答案文字 `text-base leading-relaxed`

#### 7.4 全局触控优化
- 所有按钮/链接最小点击区域 `min-h-[44px] min-w-[44px]`
- 输入框 focus 状态增加 `ring-2 ring-[#7c3aed]/30`（移动端视觉反馈更明显）
- 禁用横屏滚动：`body { overflow-x: hidden; }`（已在 Tailwind 中确保）

#### 7.5 性能与加载
- Hero 背景 SVG pattern 改为 `opacity-20`（当前 0.3，减少渲染开销）
- 图片/Logo 墙区域使用 `loading="lazy"`（后续接入真实图片时）

**验收标准**：
- [ ] iPhone SE (375px) 宽度下无横向滚动条
- [ ] Lighthouse Mobile 评分 ≥ 85
- [ ] 所有交互元素触控区域 ≥ 44×44px
- [ ] 表单输入时 iOS 不自动缩放页面（input font-size ≥ 16px）
- [ ] 核心转化路径（Demo → Pricing → CTA）在移动端可在 30 秒内完成

**预期影响**：移动端转化率提升 +10%~20%，跳出率降低。

---

## 附录 A：颜色速查表

| 用途 | 色值 | Tailwind 类名 |
|---|---|---|
| 品牌主紫 | `#7c3aed` | `text-[#7c3aed] bg-[#7c3aed]` |
| 品牌深紫 | `#5b21b6` | 渐变终点色 |
| CTA 琥珀主 | `#fbbf24` → `#f59e0b` | `from-[#fbbf24] to-[#f59e0b]` |
| CTA 琥珀深 | `#d97706` | hover 终点 |
| 成功绿 | `#22c55e` | `text-green-500` |
| 风险红 | `#ef4444` | `text-red-500 bg-red-50` |
| 警告橙 | `#f59e0b` | `text-amber-500` |
| WhatsApp 绿 | `#22c55e` / `#16a34a` | `bg-green-500 hover:bg-green-600` |

## 附录 B：文件变更清单

| 操作 | 文件路径 | 说明 |
|---|---|---|
| 修改 | `src/app/page.tsx` | 大量增删：SocialProofBar、InteractiveDemo、Pricing、FAQ、Footer CTA |
| 新增 | `src/components/SocialProofBar.tsx` | P0-1 信任背书组件 |
| 新增 | `src/components/InteractiveDemo.tsx` | P0-3 实时演示区组件 |
| 修改 | `src/app/globals.css` | 增加 `animate-pulse-subtle`、`faq-content` 动画、全局触控优化 |
| 修改 | `src/components/SubscribeButton.tsx` | 如有需要调整 loading 文案 |
| 修改 | `src/app/layout.tsx` | 如需引入外部字体或图标库 |

## 附录 C：开发顺序建议

```
Day 1: P0-2 (CTA 颜色体系 + globals.css 动画) → P0-1 (SocialProofBar 组件)
Day 2: P0-3 (InteractiveDemo 组件 + Features 文案)
Day 3: P1-4 (Pricing 重构)
Day 4: P1-5 (FAQ 动画 + 分组) + P1-6 (Footer + WhatsApp FAB)
Day 5: P2-7 (移动端专项 + 全局测试)
```

---

> **备注**：所有文案已按中文用户习惯优化。如需针对巴西/墨西哥本地卖家推出葡语/西语版本 Landing Page，请单独提需。
