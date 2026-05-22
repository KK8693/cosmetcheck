# CosmetCheck Landing Page 优化方案

> **版本**: v1.0  
> **日期**: 2025-05-22  
> **状态**: 待评审  
> **范围**: 首页 (HeroSection + Navbar + InteractiveDemo + Footer)  

---

## 一、问题诊断摘要

| # | 问题 | 影响 | 位置 |
|---|------|------|------|
| 1 | 主标题上方留白过多 | 首屏内容下沉，CTA 可见度下降 | HeroSection `pt-16 md:pt-20` + `py-12 md:py-16` |
| 2 | 平台 Logo 视觉不够明显 | 信任背书弱化，像普通标签 | Logo 墙 `span` 标签，`text-xs` 过小 |
| 3 | 白色框（表单输入框）文案不当 | 占位符缺乏示例引导，转化率损失 | Textarea `placeholder` |
| 4 | 背景纯黑 `#0D0D12` 缺乏质感 | 视觉疲劳，不够高级 | `globals.css` `.dark` + Hero bg |
| 5 | 导航栏初始状态融入背景 | 导航辨识度低 | Navbar 非滚动态 `bg-[#0D0D12]` |
| 6 | 表单区域缺乏立体感和信任元素 | 用户疑虑未消除，跳出率高 | 表单下方无 SSL/社会证明 |
| 7 | 按钮无微动效、加载态粗糙 | 交互反馈弱，重复提交风险 | Button 组件 |
| 8 | 副标题分行过多，信息密度低 | 阅读跳跃，核心卖点分散 | `subtitleShort` + `ctaLine` |

---

## 二、设计系统规范更新

### 2.1 配色系统（全局替换）

```css
/* globals.css .dark 区块替换 */
--bg-primary:     #0F1419;    /* 暗炭灰，替代 #0D0D12 */
--bg-surface:     #1A1A24;    /* 卡片/容器背景 */
--bg-elevated:    #252530;    /* 悬浮/ elevated 层 */

--text-primary:   #FFFFFF;    /* 标题 */
--text-secondary: #E0E0E0;    /* 正文（替代纯白降低刺眼） */
--text-muted:     #9CA3AF;    /* 辅助/禁用 */

--brand-amber:    #FFB800;    /* 主强调色 */
--brand-amber-glow: rgba(255, 184, 0, 0.25);

--border-subtle:  rgba(255, 255, 255, 0.08);
--border-hover:   rgba(255, 255, 255, 0.15);
```

### 2.2 排版层级

| 层级 | 元素 | 规格 |
|------|------|------|
| H1 | 主标题 | `clamp(2.5rem, 5vw, 4rem)` / `font-weight: 800` / `line-height: 1.1` |
| H2 | 区块标题 | `clamp(1.75rem, 3vw, 2.5rem)` / `font-weight: 700` |
| Body | 正文 | `font-size: 1rem` / `font-weight: 400` / `line-height: 1.6` / `color: #E0E0E0` |
| Caption | 小字 | `font-size: 0.75rem` / `color: #9CA3AF` |

### 2.3 间距系统

- Hero 顶部留白：`pt-20 md:pt-24`（给 Navbar 高度 64px/80px 留足安全区）
- Hero 内边距：`py-8 md:py-12`（从 `py-12 md:py-16` 压缩）
- 段落间距：`space-y-4`（段落间留白增加）

---

## 三、模块级修改方案

### 3.1 HeroSection（最高优先级）

#### A. 留白压缩
```
当前: <div className="min-h-screen bg-[#0D0D12] pt-16 md:pt-20">
      <section ... className="... py-12 md:py-16">
修改: <div className="min-h-screen bg-[#0F1419] pt-20 md:pt-24">
      <section ... className="... py-8 md:py-10">
```

#### B. 副标题合并（文案修改）
```
当前: 两行独立文本
  - subtitleShort: "一键检测巴西/墨西哥等5国合规，AI自动生成高转化Listing — 免费开始"
  - ctaLine: "AI一键检测，最快48小时上架"

修改: 合并为单行，移除 `ctaLine`，`subtitleShort` 改为：
  "免费一键检测巴西、墨西哥等 5 国法规，AI 自动生成高转化 Listing，最快 48 小时上架。"

实现: 删除第 393-395 行 `ctaLine` 段落，仅保留一行 subtitle
```

#### C. 平台 Logo 墙视觉强化
```
当前: text-xs span 标签，文字直接写死
修改:
  1. 使用真实 Logo SVG（Amazon、Mercado Livre、Shopee、TikTok Shop、SHEIN）
  2. 统一去色为灰度 (#9CA3AF)，hover 恢复彩色
  3. 放入带微光边框的横向容器：
     - 容器: bg-[#1A1A24]/60 border border-white/10 rounded-xl px-6 py-3
     - 或改为弧形排列 + "等平台" 字样
  4. 文字标签升级: text-sm font-medium，增加 backdrop-blur
```

#### D. 表单区域（玻璃拟态强化 + 信任密度）
```
1. 容器样式升级:
   - 从 bg-[#1A1A24]/80 → bg-[#1A1A24]/60
   - 增加微妙内阴影: shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]
   - 边框: border border-white/10 → 1px solid rgba(255,255,255,0.08)

2. 输入框美化:
   - placeholder 颜色: text-white/50 → text-[#6B7280]
   - focus 状态: ring-2 ring-[#FFB800]/50 border-[#FFB800]/30
   - 增加外发光: shadow-[0_0_12px_rgba(255,184,0,0.1)]

3. 国家选择器（胶囊按钮）:
   - 选中态: bg-[#FFB800] text-[#0F1419]（从白底蓝字改为琥珀色）
   - 未选中态: bg-white/5 text-white/60 hover:bg-white/10
   - 形状: 保持 rounded-full，增加 min-h-[48px]

4. 智能占位符（文案修改）:
   - 产品名称: "请输入产品名称，如 Vitamin C Serum"
   - 成分: "输入成分列表，如 Aqua, Glycerin, Niacinamide..."
   - 卖点: "描述产品核心卖点，如 美白淡斑、保湿修护..."

5. 信任密度（新增，放在按钮上方）:
   <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#9CA3AF] mt-4">
     <span className="flex items-center gap-1">
       <Lock className="w-3 h-3" /> SSL 加密传输
     </span>
     <span className="flex items-center gap-1">
       <CreditCard className="w-3 h-3" /> 无需信用卡
     </span>
     <span className="flex items-center gap-1">
       <Users className="w-3 h-3" /> 1,200+ 跨境卖家已使用
     </span>
   </div>

6. 按钮反馈升级:
   - 悬停: hover:translate-y-[-2px] hover:shadow-lg hover:shadow-amber-500/20
   - 加载态: 文字变为 "AI 正在检测..." + Spinner 旋转图标
   - 禁用态: opacity-50 cursor-not-allowed
```

### 3.2 Navbar 导航栏

```
1. 背景升级:
   - 非滚动态: bg-[#0F1419]/90 backdrop-blur-xl（从纯黑改为半透明毛玻璃）
   - 滚动态: bg-[#0F1419]/95 backdrop-blur-xl border-b border-white/5

2. 选中状态指示（新增）:
   - 当前锚点菜单项底部增加 2px 发光指示线
   - 样式: after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-4 after:h-0.5 after:rounded-full after:bg-[#FFB800] after:shadow-[0_0_8px_rgba(255,184,0,0.6)]

3. 移动端:
   - 菜单按钮点击区 ≥ 48px
   - 下拉菜单背景: bg-[#0F1419]/98 backdrop-blur-xl
```

### 3.3 InteractiveDemo（交互演示区）

```
1. 配色对齐:
   - section bg: bg-[#1A1A24] → bg-[#0F1419]
   - Card bg: bg-[#252530] 保持
   - 强调色: #00A86B 保持（交互 Demo 用绿色表示通过，与主 CTA 色区分）

2. 卡片玻璃拟态:
   - 增加 backdrop-blur-sm
   - 边框: border-white/10

3. 国家选择器对齐 Hero:
   - 选中态改为胶囊形状 rounded-full
   - 文字样式统一
```

### 3.4 按钮全局微动效（新增 CSS）

```css
/* globals.css 新增 */
.btn-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.btn-lift:hover:not(:disabled) {
  transform: translateY(-2px);
}
.btn-lift:active:not(:disabled) {
  transform: translateY(0);
}
```

---

## 四、MoSCoW 优先级

### Must Have（P0）— 直接影响转化率
| # | 任务 | 预估工时 | 文件 |
|---|------|---------|------|
| 1 | 主标题上方留白压缩 | 15min | HeroSection.tsx L362, L366 |
| 2 | 副标题文案合并 | 15min | messages/*.json `subtitleShort` + 删除 `ctaLine` |
| 3 | 表单占位符文案优化 | 15min | messages/*.json `productNamePlaceholder` 等 |
| 4 | 平台 Logo 墙视觉强化（去色+容器） | 1h | HeroSection.tsx L374-388 |
| 5 | 信任密度元素新增（SSL/免卡/社会证明） | 30min | HeroSection.tsx 表单下方 |
| 6 | 背景色全局替换 #0D0D12 → #0F1419 | 30min | globals.css + 所有硬编码 bg 引用 |
| 7 | 按钮悬停微动效 + 加载态 | 30min | globals.css + HeroSection.tsx |

### Should Have（P1）— 提升质感
| # | 任务 | 预估工时 | 文件 |
|---|------|---------|------|
| 8 | Navbar 毛玻璃背景 + 选中指示线 | 45min | Navbar.tsx |
| 9 | 表单容器玻璃拟态强化（边框/阴影） | 30min | HeroSection.tsx L398 |
| 10 | 输入框 focus 高亮 + 外发光 | 30min | HeroSection.tsx input className |
| 11 | 正文颜色统一为 #E0E0E0 | 30min | 全局搜索 `text-white/` 替换策略 |
| 12 | 主标题响应式 clamp 字号 | 15min | HeroSection.tsx L369 |

### Could Have（P2）— 锦上添花
| # | 任务 | 预估工时 | 文件 |
|---|------|---------|------|
| 13 | 真实平台 Logo SVG 替换文字标签 | 1h | 新增 assets/ 或 inline SVG |
| 14 | Logo 弧形排列 + "等平台" 字样 | 45min | HeroSection.tsx |
| 15 | 实时邮箱格式验证（绿色对勾） | 1h | HeroSection.tsx + 验证逻辑 |
| 16 | 导航栏多步进度条（Step 1/3） | 1h | 新增 ProgressBar 组件 |
| 17 | 渐变光晕视线引导 | 45min | HeroSection.tsx 背景层 |

### Won't Have（本次迭代不做）
- 关闭弹窗/通知（当前无弹窗干扰）
- 移动端单列布局大改（当前已有响应式）

---

## 五、成功指标

| 指标 | 基准 | 目标 | 验证方式 |
|------|------|------|---------|
| 首屏 CTA 点击率 | 待定 | +15% | Vercel Analytics / Clarity |
| 表单填写完成率 | 待定 | +20% | 事件追踪 |
| 跳出率 | 待定 | -10% | Analytics |
| 页面加载性能 | 待定 | LCP < 2.5s | Lighthouse |

---

## 六、风险与依赖

| 风险 | 等级 | 缓解措施 |
|------|------|---------|
| 配色全局替换可能影响其他页面 | 中 | 使用 CSS 变量集中管理，批量替换后全站视觉回归测试 |
| 平台 Logo SVG 版权问题 | 低 | 使用官方品牌资源库或文字+图标替代方案 |
| next-intl 翻译键变更需同步 4 语言 | 中 | 先改 `en.json` 作为基准，再批量同步到 zh/pt-BR/es-MX |
| 毛玻璃效果在低性能设备上卡顿 | 低 | `backdrop-blur` 使用 `supports` 查询降级 |

---

## 七、实施建议顺序

```
Day 1 (2h):
  → P0-1,2,3: 留白 + 文案合并 + 占位符
  → P0-6: 背景色替换
  
Day 1 下午 (1.5h):
  → P0-4: Logo 墙视觉强化
  → P0-5: 信任密度元素
  → P0-7: 按钮动效

Day 2 (2h):
  → P1-8: Navbar 优化
  → P1-9,10,11,12: 表单质感 + 排版
  
Day 2 下午 (可选):
  → P2-13,14: 真实 Logo + 弧形排列
```

---

*本方案由 产品与市场总监 编制，待 CTO 审批后分配给前端开发执行。*
