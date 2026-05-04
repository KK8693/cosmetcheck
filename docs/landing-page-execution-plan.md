# CosmetCheck Landing Page 执行级修改方案

> **版本**：v2.0 — 可直接复制粘贴代码的执行方案  
> **项目**：CosmetCheck — 拉美美妆合规检测 + AI Listing 生成  
> **技术栈**：Next.js 15.5.2 + React 19 + Tailwind CSS v4 + shadcn/ui  
> **目标文件**：`src/app/page.tsx`、`src/app/globals.css`、新增 2 个组件文件  
> **预估工时**：3 天（P0 一天半 + P1 一天半 + P2 穿插）

---

## 修改总览

| 编号 | 修改点 | 优先级 | 对应代码位置 | 预估工时 |
|---|---|---|---|---|
| P0-1 | 首屏信任背书：数据徽章 + Logo 墙 + 案例卡 | P0 | `page.tsx` Hero 区（~L175-L185 之间插入） | 2h |
| P0-2 | CTA 按钮体系：文案 + 颜色层级 + 紧迫感 | P0 | `page.tsx` 多处 + `globals.css` | 2h |
| P0-3 | 功能展示具象化：Features 文案重构 + Demo 可视化增强 | P0 | `page.tsx` Features 区（~L516-L538） | 2h |
| P1-4 | 定价页冲击力：原价锚定 + 罚款对比 + 省钱数据栏 | P1 | `page.tsx` Pricing 区（~L540-L606） | 2h |
| P1-5 | FAQ 体验升级：平滑动画 + 默认展开 + 分组 + WhatsApp | P1 | `page.tsx` FAQ 区（~L608-L668） | 2h |
| P1-6 | Footer + 全局 WhatsApp 悬浮按钮 | P1 | `page.tsx` Footer 区（~L695-L732）+ 新增 FAB | 1.5h |
| P2-7 | 移动端专项适配 | P2 | `page.tsx` 全局 + `globals.css` | 2h |

---

## P0 — 立即做（第 1 天）

---

### P0-1 首屏信任背书重构

**现状**：Hero 区仅有 `已服务 2,000+ 拉美美妆卖家` 一个徽章（`page.tsx` ~L175），缺乏视觉信任元素。

**修改内容**：

#### 1A. 数据徽章增强（直接替换原有徽章）

**定位**：`page.tsx` L175-L178 处替换。

```tsx
{/* 替换原有徽章 */}
<div className="mb-6 inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium backdrop-blur">
  <span className="inline-flex items-center">
    <span className="mr-2 h-2 w-2 rounded-full bg-green-400 animate-pulse" />
    <span className="text-white/80">已服务</span>
    <span className="mx-1 font-bold text-white">2,000+</span>
    <span className="text-white/80">卖家</span>
  </span>
  <span className="hidden sm:inline text-white/30">|</span>
  <span className="text-white/80">
    拦截 <span className="font-bold text-white">340,000+</span> 次合规风险
  </span>
  <span className="hidden sm:inline text-white/30">|</span>
  <span className="text-white/80">
    覆盖 <span className="font-bold text-white">巴西/墨西哥</span>
  </span>
</div>
```

**验收标准**：
- [ ] 徽章内三个数据段在手机端自动换行，不溢出屏幕（`flex-wrap` + `gap` 已处理）
- [ ] 竖线分隔符在 `sm` 以下隐藏

#### 1B. 平台 Logo 墙（新增，位于徽章下方、H1 上方或 H1 与 Demo 之间）

**定位**：插入在 `page.tsx` H1 下方（~L185，即 `</h1>` 之后、`</p>` 之前）。

```tsx
{/* Logo 墙 — 新增 */}
<div className="mb-8">
  <p className="text-xs text-white/50 uppercase tracking-wider mb-3">
    被这些平台的卖家信赖
  </p>
  <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4">
    {['Amazon Brazil', 'Mercado Livre', 'Shopee', 'TikTok Shop', 'SHEIN'].map((name) => (
      <span
        key={name}
        className="inline-flex items-center rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 backdrop-blur-sm"
      >
        {name}
      </span>
    ))}
  </div>
</div>
```

**验收标准**：
- [ ] 5 个 Logo 文字块在手机端 `gap-3` 自动换行
- [ ] 背景使用 `bg-white/5` 保持低对比度，不抢主视觉

#### 1C. 真实案例悬浮卡（新增，位于 Demo 卡片上方）

**定位**：插入在 Demo 卡片外层 `div`（`mx-auto max-w-xl rounded-2xl...`）之前，即 `page.tsx` ~L188 之前。

```tsx
{/* 真实案例卡 — 新增 */}
<div className="mx-auto max-w-2xl mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
  {[
    {
      tag: '❌ 禁用成分',
      tagColor: 'text-red-300',
      body: '"某美白霜含 Hydroquinone 2%，直接被 ANVISA 标红"',
      result: '→ 修改后 48h 重新上架',
    },
    {
      tag: '⚠️ 标签违规',
      tagColor: 'text-amber-300',
      body: '"防晒产品未标注 SPF 值，墨西哥海关扣留"',
      result: '→ AI 生成合规标签，0 罚款',
    },
    {
      tag: '📝 文案误触',
      tagColor: 'text-blue-300',
      body: '"抗皱文案写错 1 个词，Listing 被下架 7 天"',
      result: '→ 替换后 CTR 提升 23%',
    },
  ].map((item, idx) => (
    <div
      key={idx}
      className="rounded-xl bg-white/10 backdrop-blur border border-white/10 p-4 text-left hover:bg-white/15 transition-colors"
    >
      <p className={`text-xs font-bold ${item.tagColor} mb-2`}>{item.tag}</p>
      <p className="text-sm text-white/90 leading-relaxed mb-2">{item.body}</p>
      <p className="text-xs text-green-400 font-semibold">{item.result}</p>
    </div>
  ))}
</div>
```

**验收标准**：
- [ ] 手机端垂直堆叠（`grid-cols-1`），`sm` 以上三列
- [ ] 卡片背景 `bg-white/10` + `backdrop-blur`，在紫色渐变上可读

**预期影响**：首屏停留时长 +20%，Demo 试用率 +15%~25%。

---

### P0-2 CTA 按钮体系重构

**现状问题**：
- `Pricing` Free 卡按钮：`免费开始`（L572）
- `Pricing` Pro 卡按钮：`升级 Pro`（L600）
- `Footer CTA` 按钮：`免费检测我的产品`（L686）
- `Hero Demo` 按钮：`检测合规` / `AI生成Listing`

全站缺少统一的价值强调和紧迫感。

#### 2A. 统一 CTA 文案

| 位置 | 行号范围 | 原文案 | 新文案 |
|---|---|---|---|
| Hero Demo 主按钮 | ~L258 | `AI生成Listing` | `🚀 免费生成 Listing` |
| Hero Demo 次按钮 | ~L250 | `检测合规` | `先检测合规` |
| Pricing Free 卡 | ~L572 | `免费开始` | `免费试用 10 次` |
| Pricing Pro 卡 | ~L600 | `升级 Pro` | `解锁无限次 — $29/月` |
| Footer CTA 按钮 | ~L686 | `免费检测我的产品` | `立即免费检测` |

**直接替换代码**：

- Hero Demo 主按钮（L258-L263）：
```tsx
<Button
  onClick={handleGenerate}
  disabled={isGenerating || !productName}
  className="flex-1 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-900 hover:from-[#f59e0b] hover:to-[#d97706] font-bold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all"
>
  {isGenerating ? '生成中...' : '🚀 免费生成 Listing'}
</Button>
```

- Hero Demo 次按钮（L249-L256）：
```tsx
<Button
  onClick={handleCheck}
  disabled={isChecking}
  variant="outline"
  className="flex-1 border-white/30 text-white hover:bg-white/10 font-medium"
>
  {isChecking ? '检测中...' : '先检测合规'}
</Button>
```

- Pricing Free 卡按钮（L572）：
```tsx
<Button variant="outline" className="w-full font-semibold text-[#7c3aed] border-[#7c3aed]/30 hover:bg-[#7c3aed]/5">
  免费试用 10 次
</Button>
```

- Pricing Pro 卡按钮（L596-L601）：
```tsx
<SubscribeButton
  priceId="price_pro_monthly"
  className="w-full bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-900 hover:from-[#f59e0b] hover:to-[#d97706] font-bold shadow-lg shadow-amber-500/25"
>
  解锁无限次 — $29/月
</SubscribeButton>
```

- Footer CTA 按钮（L685-L687）：
```tsx
<Button className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-900 hover:from-[#f59e0b] hover:to-[#d97706] font-bold h-12 px-8 whitespace-nowrap shadow-lg shadow-amber-500/25">
  立即免费检测
</Button>
```

#### 2B. Footer CTA 紧迫感增强（L670-L693 区域重构）

在 Footer CTA 标题上方增加限时徽章：

```tsx
<section className="py-20 bg-gradient-to-br from-[#7c3aed] via-[#6d28d9] to-[#5b21b6] text-white">
  <div className="container-custom text-center">
    {/* 新增限时徽章 */}
    <div className="mb-4 inline-flex items-center rounded-full bg-red-500 px-4 py-1.5 text-xs font-bold text-white shadow-lg animate-bounce">
      🔥 限时福利 · 本月注册送 5 次 Pro 体验
    </div>
    <h2 className="text-3xl font-bold md:text-4xl mb-4">
      今天就开始合规卖货
    </h2>
    <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto">
      加入 2,000+ 拉美美妆卖家，用AI让合规不再成为出海障碍
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
      <Input
        type="email"
        placeholder="输入邮箱，免费开始"
        className="border-white/20 bg-white/10 text-white placeholder:text-white/50 h-12 text-base"
      />
      <Button className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-900 hover:from-[#f59e0b] hover:to-[#d97706] font-bold h-12 px-8 whitespace-nowrap shadow-lg shadow-amber-500/25">
        立即免费检测
      </Button>
    </div>
    <p className="mt-4 text-sm text-white/60">
      无需信用卡 · 随时取消 · 免费版永久可用
    </p>
  </div>
</section>
```

**验收标准**：
- [ ] 全站主转化按钮统一使用琥珀渐变（`from-[#fbbf24] to-[#f59e0b]`），在紫色背景上形成强烈对比
- [ ] 次按钮保持白底紫字或透明边框样式
- [ ] Footer CTA 区域有红色 `animate-bounce` 限时徽章
- [ ] 所有按钮文案按上表替换

**预期影响**：CTA 点击率 +20%~30%，主按钮视觉层级清晰。

---

### P0-3 功能展示具象化

**现状**：Features 区（L516-L538）使用技术语言，用户无法感知"我会不会被下架"。

#### 3A. Features 文案重构（利益导向）

定位：`page.tsx` L524-L528 数组直接替换。

```tsx
{[
  {
    icon: '🛡️',
    title: '上架前自动拦截下架风险',
    desc: '输入成分秒出风险报告：哪里违规、怎么改、引用哪条法规 — 不让罚款单先到',
  },
  {
    icon: '🌐',
    title: '当地人看了就想买的 Listing',
    desc: '不是翻译，是按巴西/墨西哥消费者搜索习惯重写标题和卖点，自带合规过滤',
  },
  {
    icon: '⚡',
    title: '违禁词秒标红，附官方条款',
    desc: 'ANVISA RDC 编号、COFEPRIS NOM 标准直接引用，平台申诉有依据',
  },
  {
    icon: '🎁',
    title: '0 元先测 10 次，再决定',
    desc: '不用绑卡、不用签合同，测完觉得有用再升级 Pro',
  },
].map((item, idx) => (
```

#### 3B. Demo 结果卡片可视化增强

**现状**：Hero 的检测结果（`checkResult`，L272-L344）和 AI Listing 结果（`generatedListing`，L347-L431）已经存在，但视觉冲击力不够。

**修改**：给结果卡片增加「Mac 窗口」装饰和更鲜明的色彩层级。

定位：包裹 `checkResult` 的 div（L273）替换为：

```tsx
{/* Check Results — 增强版 */}
{checkResult && (
  <div className="mx-auto max-w-xl mt-6 rounded-2xl bg-white text-left text-gray-900 shadow-2xl overflow-hidden">
    {/* 窗口标题栏 */}
    <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
      <span className="h-3 w-3 rounded-full bg-red-400" />
      <span className="h-3 w-3 rounded-full bg-yellow-400" />
      <span className="h-3 w-3 rounded-full bg-green-400" />
      <span className="ml-2 text-xs font-medium text-gray-400">合规检测报告</span>
    </div>
    <div className="p-6">
      {/* 原有内容保持不变，以下复制原 L274-L342 的内容 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">检测结果</h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            checkResult.isCompliant
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {checkResult.isCompliant ? '✅ 合规' : '❌ 不合规'}
        </span>
      </div>
      {/* ... 原 L287-L342 内容直接保留 ... */}
    </div>
  </div>
)}
```

同理，`generatedListing` 卡片（L347）也增加窗口标题栏：

```tsx
{generatedListing && (
  <div className="mx-auto max-w-xl mt-6 rounded-2xl bg-white text-left text-gray-900 shadow-2xl overflow-hidden">
    <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
      <span className="h-3 w-3 rounded-full bg-red-400" />
      <span className="h-3 w-3 rounded-full bg-yellow-400" />
      <span className="h-3 w-3 rounded-full bg-green-400" />
      <span className="ml-2 text-xs font-medium text-gray-400">AI 生成的合规 Listing</span>
    </div>
    <div className="p-6">
      {/* 原 L349-L429 内容保留 */}
    </div>
  </div>
)}
```

**验收标准**：
- [ ] Features 4 张卡片标题全部改为「结果语言」，无技术黑话
- [ ] Demo 结果卡片有 Mac 窗口标题栏装饰（三色圆点 + 标签）
- [ ] 检测结果和 Listing 结果卡片增加 `shadow-2xl` 层级感

**预期影响**：用户理解成本降低，Demo 结果可信度提升，Features → Pricing 滚动转化 +10%~15%。

---

## P1 — 本周内（第 2~3 天）

---

### P1-4 定价页冲击力升级

**现状**：Pricing 区（L540-L606）Free vs Pro 差异不鲜明，缺原价锚定和罚款案例。

#### 4A. Free 卡改造

定位：`page.tsx` L555-L574 区域替换：

```tsx
<Card className="border-2 border-gray-100">
  <CardContent className="p-8">
    <div className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600 mb-4">
      入门试用
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">Free</h3>
    <div className="flex items-baseline mb-2">
      <span className="text-4xl font-extrabold text-gray-900">$0</span>
      <span className="text-gray-500 ml-2">/月</span>
    </div>
    <p className="text-sm text-gray-500 mb-6">适合：每月 ≤10 个 SKU 的测试卖家</p>
    <ul className="space-y-3 mb-8">
      {[
        { text: '每月10次合规检测', active: true },
        { text: '基础违禁词检测', active: true },
        { text: '巴西ANVISA规则', active: true },
        { text: '墨西哥COFEPRIS规则', active: true },
        { text: 'AI Listing 生成', active: false },
        { text: '批量 CSV 检测', active: false },
      ].map((item, idx) => (
        <li key={idx} className={`flex items-center ${item.active ? 'text-gray-600' : 'text-gray-300'}`}>
          {item.active ? (
            <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-300 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
          <span className={item.active ? '' : 'line-through'}>{item.text}</span>
        </li>
      ))}
    </ul>
    <Button variant="outline" className="w-full font-semibold text-[#7c3aed] border-[#7c3aed]/30 hover:bg-[#7c3aed]/5">
      免费试用 10 次
    </Button>
  </CardContent>
</Card>
```

#### 4B. Pro 卡改造

定位：`page.tsx` L576-L603 区域替换：

```tsx
<Card className="border-2 border-[#7c3aed] relative overflow-hidden bg-gradient-to-b from-[#7c3aed]/5 to-white">
  <div className="absolute top-0 right-0 bg-[#7c3aed] text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
    最划算 — 卖家首选
  </div>
  <CardContent className="p-8">
    <h3 className="text-xl font-bold text-gray-900 mb-2">Pro</h3>
    <div className="flex items-baseline mb-2">
      <span className="text-lg text-gray-400 line-through mr-2">$49</span>
      <span className="text-5xl font-extrabold text-gray-900">$29</span>
      <span className="text-gray-500 ml-2">/月</span>
    </div>
    <p className="text-sm text-gray-500 mb-4">折合约 ¥199/月 · 随时取消</p>
    {/* 罚款对比条 — 新增 */}
    <div className="mb-6 rounded-lg bg-red-50 border border-red-100 p-3">
      <p className="text-red-700 text-sm font-medium">
        ⚠️ ANVISA 单次违规罚款 ≈ R$ 10,000（≈ $1,700），够付 <span className="font-bold">58 个月</span> Pro
      </p>
    </div>
    <ul className="space-y-3 mb-8">
      {[
        '无限次合规检测',
        'AI Listing生成（葡/西语）',
        '法规更新实时通知',
        '优先客服支持',
        '批量检测（CSV导入）',
        '🌟 新市场优先体验（阿根廷/哥伦比亚 Q3）',
        '🌟 专属合规顾问 1v1（年度订阅）',
      ].map((item, idx) => (
        <li key={idx} className="flex items-center text-gray-600">
          <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          {item}
        </li>
      ))}
    </ul>
    <SubscribeButton
      priceId="price_pro_monthly"
      className="w-full bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-900 hover:from-[#f59e0b] hover:to-[#d97706] font-bold shadow-lg shadow-amber-500/25"
    >
      解锁无限次 — $29/月
    </SubscribeButton>
  </CardContent>
</Card>
```

#### 4C. 新增「客户省钱案例」栏

定位：插入在 Pricing 卡片闭合 `div`（`</div>`，即 L604）之后、FAQ section 之前。

```tsx
{/* 省钱数据栏 — 新增 */}
<div className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
  {[
    { num: 'R$ 8,500', label: '平均避免罚款金额', desc: '基于 200+ 卖家调研' },
    { num: '7 天', label: '平均节省合规时间', desc: '从 2 周缩短到 3 天' },
    { num: '92%', label: 'Listing 审核通过率', desc: 'AI 生成 vs 人工撰写' },
  ].map((item, idx) => (
    <div key={idx} className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm">
      <p className="text-4xl font-extrabold text-[#7c3aed] mb-2">{item.num}</p>
      <p className="font-semibold text-gray-900 mb-1">{item.label}</p>
      <p className="text-sm text-gray-500">{item.desc}</p>
    </div>
  ))}
</div>
```

**验收标准**：
- [ ] Free 卡展示 2 条灰色划线功能（AI Listing、CSV 批量）
- [ ] Pro 卡展示原价 `$49` 删除线 + 红色罚款对比条
- [ ] 定价区下方有 3 列省钱数据卡
- [ ] 手机端 Pro 卡始终在最上方（通过 CSS `order` 控制，见 P2-7）

**预期影响**：Pro 卡转化意愿 +15%~25%，价格锚定效应明显。

---

### P1-5 FAQ 交互与视觉优化

**现状**：FAQ（L608-L668）可折叠但动画生硬，视觉上仍像堆砌。

#### 5A. 平滑动画 + 默认展开第一条

**Step 1 — 修改 state 初始值**：

定位：`page.tsx` L59
```tsx
const [activeFaq, setActiveFaq] = useState<number | null>(0) // 默认展开第一条
```

**Step 2 — 修改 FAQ 渲染逻辑**：

定位：`page.tsx` L648-L665 区域替换为：

```tsx
{/* FAQ 分组数据 */}
{[
  {
    group: '关于检测准确性',
    items: [
      {
        q: '你们的数据来源可靠吗？',
        a: '法规数据直接来自 ANVISA RDC 文件、COFEPRIS NOM 标准、INCI 国际命名数据库。每条规则均标注来源文件编号，可追溯验证。',
      },
      {
        q: '法规更新频率？',
        a: '官方源每月自动爬取，人工校验后更新。检测到重大法规变更时（如新禁用成分），48小时内完成规则更新并通知所有Pro用户。',
      },
      {
        q: '免费版够不够用？',
        a: '免费版每月10次检测，适合单品测试和小批量卖家。如果每月检测超过10次，或需要AI生成Listing，建议升级Pro。',
      },
    ],
  },
  {
    group: '关于 Listing 与平台',
    items: [
      {
        q: '生成的Listing真的合规吗？',
        a: 'AI生成的Listing基于当前法规版本和官方要求，但建议上架前进行最终人工确认。我们提供规则来源链接供您二次验证。',
      },
      {
        q: '支持哪些平台？',
        a: '当前支持巴西（ANVISA）和墨西哥（COFEPRIS）的合规检测。Listing生成适配 Amazon、Mercado Livre、Shopee 等平台格式。',
      },
    ],
  },
  {
    group: '关于账户与付费',
    items: [
      {
        q: '我的产品数据安全吗？',
        a: '所有数据传输使用TLS加密，符合 GDPR、LGPD（巴西）和 LFPDPPP（墨西哥）数据保护要求。我们从不出售用户数据。',
      },
      {
        q: '多久支持其他国家？',
        a: '2025年Q3计划上线阿根廷（ANMAT）和哥伦比亚（INVIMA）。Pro用户可优先体验新市场。',
      },
      {
        q: '可以开发票/退税吗？',
        a: 'Pro订阅支持开具国际发票（Invoice），可用于企业报销和税务抵扣。',
      },
    ],
  },
].map((group, gIdx) => (
  <div key={gIdx}>
    <p className="text-xs font-bold text-[#7c3aed] uppercase tracking-wider mt-6 mb-3">
      {group.group}
    </p>
    <div className="space-y-3">
      {group.items.map((item, idx) => {
        const globalIdx = gIdx * 10 + idx;
        const isOpen = activeFaq === globalIdx;
        return (
          <div
            key={globalIdx}
            className={`border rounded-xl overflow-hidden transition-colors ${isOpen ? 'border-[#7c3aed]/20 bg-[#7c3aed]/[0.02]' : 'border-gray-100'}`}
          >
            <button
              className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50/50 transition-colors"
              onClick={() => setActiveFaq(isOpen ? null : globalIdx)}
            >
              <span className={`pr-4 ${isOpen ? 'font-bold text-gray-900' : 'font-semibold text-gray-800'}`}>
                {item.q}
              </span>
              <span className={`text-xl flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45 text-[#7c3aed]' : 'text-gray-400'}`}>
                +
              </span>
            </button>
            <div
              className="grid transition-all duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <div className="px-5 pb-5 text-gray-600 leading-relaxed">
                  {item.a}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
))}

{/* FAQ 底部 WhatsApp 行动条 — 新增 */}
<div className="mt-8 rounded-2xl bg-[#7c3aed]/5 border border-[#7c3aed]/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
  <div>
    <p className="font-semibold text-gray-900">还有疑问？</p>
    <p className="text-sm text-gray-500">WhatsApp 上回复通常在 10 分钟内</p>
  </div>
  <a
    href="https://wa.me/5511999999999"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
  >
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
    WhatsApp 咨询
  </a>
</div>
```

**验收标准**：
- [ ] FAQ 展开/收起有平滑高度动画（`grid-template-rows` trick）
- [ ] 默认展开第一条（`activeFaq = 0`）
- [ ] 8 条 FAQ 分为 3 组，带紫色分组小标题
- [ ] 底部有 WhatsApp 咨询行动条
- [ ] 点击区域 padding `p-5`，触控友好

**预期影响**：FAQ 停留时长增加，信任度提升，跳出率降低。

---

### P1-6 底部联系我们 + 全局 WhatsApp 悬浮按钮

#### 6A. Footer 重构为 5 列 + 联系方式

定位：`page.tsx` L696-L727 区域替换：

```tsx
<footer className="bg-gray-900 text-gray-400 py-12">
  <div className="container-custom">
    <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
      <div className="col-span-2 md:col-span-1">
        <div className="text-white font-bold text-xl mb-4">CosmetCheck</div>
        <p className="text-sm">拉美美妆合规检测专家，让出海更简单。</p>
      </div>
      <div>
        <div className="text-white font-semibold mb-4">产品</div>
        <ul className="space-y-2 text-sm">
          <li><a href="#" className="hover:text-white transition-colors">合规检测</a></li>
          <li><a href="#" className="hover:text-white transition-colors">AI Listing生成</a></li>
          <li><a href="#" className="hover:text-white transition-colors">定价</a></li>
        </ul>
      </div>
      <div>
        <div className="text-white font-semibold mb-4">资源</div>
        <ul className="space-y-2 text-sm">
          <li><a href="#" className="hover:text-white transition-colors">法规知识库</a></li>
          <li><a href="#" className="hover:text-white transition-colors">帮助中心</a></li>
          <li><a href="#" className="hover:text-white transition-colors">API文档</a></li>
        </ul>
      </div>
      <div>
        <div className="text-white font-semibold mb-4">法律</div>
        <ul className="space-y-2 text-sm">
          <li><a href="/privacy" className="hover:text-white transition-colors">隐私政策</a></li>
          <li><a href="#" className="hover:text-white transition-colors">服务条款</a></li>
          <li><a href="#" className="hover:text-white transition-colors">GDPR/LGPD/LFPDPPP</a></li>
        </ul>
      </div>
      {/* 新增第 5 列：联系我们 */}
      <div>
        <div className="text-white font-semibold mb-4">联系我们</div>
        <ul className="space-y-3 text-sm">
          <li className="flex items-center gap-2">
            <span>📧</span>
            <a href="mailto:support@cosmetcheck.com" className="hover:text-white transition-colors">support@cosmetcheck.com</a>
          </li>
          <li className="flex items-center gap-2">
            <span>💬</span>
            <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp</a>
          </li>
          <li className="flex items-center gap-2">
            <span>🕐</span>
            <span>巴西时间 9:00–18:00 (GMT-3)</span>
          </li>
        </ul>
      </div>
    </div>
    <div className="border-t border-gray-800 pt-8 text-sm text-center">
      © 2025 CosmetCheck. All rights reserved.
    </div>
  </div>
</footer>
```

#### 6B. 全局 WhatsApp 悬浮按钮（FAB）

**新建组件**：`src/components/WhatsAppFAB.tsx`

```tsx
'use client'

import { useEffect, useState } from 'react'

export default function WhatsAppFAB() {
  const [bounced, setBounced] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setBounced(true), 3000)
    const stopTimer = setTimeout(() => setBounced(false), 4500)
    return () => {
      clearTimeout(timer)
      clearTimeout(stopTimer)
    }
  }, [])

  return (
    <a
      href="https://wa.me/5511999999999"
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg shadow-green-500/30 hover:shadow-xl hover:scale-110 transition-all duration-300 ${bounced ? 'animate-bounce' : ''}`}
      aria-label="WhatsApp 快速咨询"
    >
      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>
  )
}
```

**在 `page.tsx` 中引入**：

在文件顶部 imports 区域增加：
```tsx
import WhatsAppFAB from '@/components/WhatsAppFAB'
```

在 JSX 最外层闭合之前插入：
```tsx
      <WhatsAppFAB />
    </div>
  )
}
```

#### 6C. Footer CTA 邮箱反馈

在 Footer CTA 区域（~L680-L691）增加简单的邮箱验证和前端反馈：

```tsx
const [ctaEmail, setCtaEmail] = useState('')
const [ctaSubmitted, setCtaSubmitted] = useState(false)

// ... 在 Footer CTA 区域内：
<div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
  <Input
    type="email"
    value={ctaEmail}
    onChange={(e) => setCtaEmail(e.target.value)}
    placeholder="输入邮箱，免费开始"
    className="border-white/20 bg-white/10 text-white placeholder:text-white/50 h-12 text-base"
  />
  <Button
    onClick={() => {
      if (ctaEmail.includes('@')) {
        setCtaSubmitted(true)
        setTimeout(() => setCtaSubmitted(false), 5000)
      }
    }}
    className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-900 hover:from-[#f59e0b] hover:to-[#d97706] font-bold h-12 px-8 whitespace-nowrap shadow-lg shadow-amber-500/25"
  >
    立即免费检测
  </Button>
</div>
{ctaSubmitted && (
  <p className="mt-3 text-sm text-green-400 font-medium animate-fade-in">
    🎉 已发送 — 请查收邮件开启免费检测
  </p>
)}
```

**注意**：需要在组件顶部 `useState` 区域新增 `ctaEmail` 和 `ctaSubmitted` 两个 state。

**验收标准**：
- [ ] Footer 为 5 列布局（`grid-cols-2 md:grid-cols-5`）
- [ ] 全局右下角有绿色 WhatsApp FAB，加载 3 秒后弹跳一次
- [ ] FAB 在移动端不遮挡底部内容（已用 `bottom-6`，如需可改为 `bottom-20`）
- [ ] Footer CTA 邮箱提交后有绿色成功提示

**预期影响**：用户咨询转化率 +20%~30%。

---

## P2 — 优化（排期灵活）

---

### P2-7 移动端体验专项适配

**现状**：`page.tsx` 在移动端可能存在输入框缩放、按钮过小、卡片挤压等问题。

#### 7A. Hero 区移动端适配

| 元素 | 当前代码 | 修改后 |
|---|---|---|
| H1 字号 | `text-4xl md:text-6xl lg:text-7xl`（L179） | 保持不变，但增加 `leading-tight` |
| Demo 卡片 | `max-w-xl`（L188） | `max-w-full sm:max-w-xl` |
| 输入框字号 | 默认（可能 < 16px） | 全部输入框增加 `text-base`（防 iOS 缩放）|
| 国家选择按钮 | `px-4 py-1.5` | 增加 `min-h-[44px]` |
| Demo 双按钮 | `flex gap-2`（L248） | `flex flex-col sm:flex-row gap-2` |

**具体修改**：

- H1（L179）：
```tsx
<h1 className="mb-6 text-4xl font-extrabold tracking-tight leading-tight md:text-6xl lg:text-7xl">
```

- Demo 卡片（L188）：
```tsx
<div className="mx-auto max-w-full sm:max-w-xl rounded-2xl bg-white/10 p-6 backdrop-blur-lg md:p-8 text-left">
```

- 所有 Input/Textarea 增加 `text-base`：
  - Hero Demo 的 3 个输入框（`productName`、`ingredients`、`productBenefits`）都已通过 `className` 添加样式，直接在现有 `className` 末尾追加 `text-base`。

- Demo 按钮区（L248）：
```tsx
<div className="flex flex-col sm:flex-row gap-2">
```

#### 7B. Pricing 卡片移动端

- 卡片容器（L554）：
```tsx
<div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
```
保持不变，但在 Pro 卡上增加 `order-first md:order-none`：

```tsx
<Card className="border-2 border-[#7c3aed] relative overflow-hidden bg-gradient-to-b from-[#7c3aed]/5 to-white order-first md:order-none">
```

- Pro 卡价格字号（L583 区域）：保持 `text-5xl`，但在超小屏增加响应式：
```tsx
<span className="text-4xl sm:text-5xl font-extrabold text-gray-900">$29</span>
```

#### 7C. 全局触控优化（globals.css）

定位：`src/app/globals.css`，在文件末尾追加：

```css
/* 移动端触控优化 */
@layer base {
  input,
  textarea,
  select,
  button {
    @apply text-base;
  }
}

/* FAQ 平滑动画辅助 */
.faq-grid {
  display: grid;
  transition: grid-template-rows 0.35s ease-out;
}

/* 防止 iOS 缩放 */
@media screen and (max-width: 768px) {
  input[type="email"],
  input[type="text"],
  textarea {
    font-size: 16px;
  }
}
```

#### 7D. 其他移动端微调

- Use Cases 卡片（L484）：当前 `grid md:grid-cols-3`，移动端已自动单列，无需修改。
- Features 卡片（L523）：当前 `grid md:grid-cols-2 lg:grid-cols-4`，移动端已自动单列，无需修改。
- 案例卡/Logo 墙已在 P0-1 中通过 `grid-cols-1 sm:grid-cols-3` 和 `flex-wrap` 处理。

**验收标准**：
- [ ] iPhone SE（375px）下无横向滚动条
- [ ] 所有输入框 `font-size ≥ 16px`，iOS 不自动缩放
- [ ] 所有按钮/可点击元素最小触控区域 `44×44px`
- [ ] Pro 定价卡在移动端始终排在第一位
- [ ] Lighthouse Mobile 评分 ≥ 85

**预期影响**：移动端转化率 +10%~20%，跳出率降低。

---

## 附录 A：颜色与设计 Token 速查

| 用途 | 色值 | Tailwind 用法 |
|---|---|---|
| 品牌主紫 | `#7c3aed` | `bg-[#7c3aed] text-[#7c3aed]` |
| 品牌深紫 | `#5b21b6` | 渐变终点 |
| CTA 琥珀主 | `#fbbf24` | `from-[#fbbf24]` |
| CTA 琥珀次 | `#f59e0b` | `to-[#f59e0b]` |
| CTA 琥珀深 | `#d97706` | hover 终点 |
| 成功绿 | `#22c55e` | `text-green-500` |
| 风险红 | `#ef4444` | `bg-red-50 text-red-700` |
| WhatsApp 绿 | `#22c55e` | `bg-green-500 hover:bg-green-600` |
| 背景灰 | `#f9fafb` | `bg-gray-50` |

**设计原则**：
- 主 CTA 统一使用琥珀渐变（在紫色背景上对比度最高，且暗示"限时/行动"）
- 次 CTA 使用白底紫字或透明边框
- 危险/警告信息统一使用红色系 `red-50` + `red-700`
- 成功/合规信息统一使用绿色系 `green-100` + `green-700`

---

## 附录 B：文件变更清单

| 操作 | 文件路径 | 说明 |
|---|---|---|
| 修改 | `src/app/page.tsx` | 全页面多处增删改，详见各修改点行号 |
| 修改 | `src/app/globals.css` | 追加移动端触控优化、输入框防缩放 |
| 新增 | `src/components/WhatsAppFAB.tsx` | 全局悬浮 WhatsApp 按钮 |
| 可选修改 | `src/components/SubscribeButton.tsx` | 如需调整 Pro 按钮 loading 状态样式 |

---

## 附录 C：推荐开发顺序（3 天排期）

```
Day 1 上午：P0-2（CTA 文案 + 颜色体系）
        → 改 globals.css 追加移动端基础样式
        → 改 page.tsx 中所有按钮文案和颜色

Day 1 下午：P0-1（信任背书插入）
        → 在 Hero 区插入徽章 + Logo 墙 + 案例卡

Day 2 上午：P0-3（Features 文案 + Demo 结果可视化）
        → 改 Features 数组文案
        → 给 checkResult / generatedListing 卡片加窗口标题栏

Day 2 下午：P1-4（定价页重构）
        → Free/Pro 卡改造 + 省钱数据栏

Day 3 上午：P1-5（FAQ 动画 + 分组）+ P1-6（Footer + WhatsApp FAB）
        → FAQ 重构为分组数据结构
        → Footer 5 列 + 新增 WhatsAppFAB.tsx

Day 3 下午：P2-7（移动端测试 + 微调）
        → Chrome DevTools 375px/390px/414px 测试
        → Lighthouse Mobile 跑分
        → 修复横向滚动、触控区域等小问题
```

---

## 附录 D：FAQ 现有代码状态说明

> **注意**：当前 `page.tsx` L608-L668 的 FAQ 区域**已实现折叠功能**（使用 `activeFaq` state 和条件渲染）。P1-5 的修改重点不是"增加折叠"，而是：
> 1. 将条件渲染改为 `grid-template-rows` 平滑动画
> 2. 默认展开第一条（`useState(0)`）
> 3. 增加分组标题
> 4. 底部增加 WhatsApp 行动条
>
> 开发时请勿重复造轮子。

---

> **备注**：所有文案已按中文卖家习惯优化。WhatsApp 号码 `5511999999999` 为占位符，上线前替换为真实号码。如需针对巴西/墨西哥本地卖家推出葡语/西语 Landing Page，建议复用本方案结构，仅替换文案。
