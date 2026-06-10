# Platform 页面数据准确性 SOP

> **与**: PHASE2_OPS_PLAN.md 配套使用  
> **目标**: 确保 3 平台 × 2 国家 × 7 品类 = 42 页面的数据准确可靠、可追溯

---

## 一、数据来源白名单

### 1.1 平台官方渠道（一级来源，必须引用）

| 平台 | 国家 | 官方卖家中心 URL | 状态验证日期 |
|------|------|---------------------|-------------|
| Amazon | Brazil | https://sell.amazon.com.br/ | 需验证 200 OK |
| Amazon | Mexico | https://sell.amazon.com.mx/ | 需验证 200 OK |
| Mercado Livre | Brazil | https://www.mercadolivre.com.br/ajuda | 需验证 200 OK |
| Mercado Livre | Mexico | https://www.mercadolibre.com.mx/ayuda | 需验证 200 OK |
| Shopee | Brazil | https://seller.shopee.com.br/ | 需验证 200 OK |
| Shopee | Mexico | https://seller.shopee.com.mx/ | 需验证 200 OK |

### 1.2 法规引用（一级来源，必须一致）

| 法规 | 来源 | 页面链接 |
|------|------|----------|
| ANVISA RDC 665/2022 | 现有页面 | /regulation/brazil |
| ANVISA RDC 430/2020 | 现有页面 | /regulation/brazil |
| COFEPRIS NOM-141-SSA1/SCF1-2012 | 现有页面 | /regulation/mexico |
| COFEPRIS Ley General de Salud | 现有页面 | /regulation/mexico |

> **强制要求**: Platform 页面的法规声明必须与现有 `/regulation/*` 页面 100% 一致。如发现矛盾，以 `/regulation/*` 页面为准，并触发法规页面更新。

---

## 二、数据验证 Checklist

### 2.1 每平台×国家组合的验证流程

```
Step 1: 收集官方信息
  └─ 访问平台官方卖家中心
  └─ 截图保存关键政策页面
  └─ 记录 URL 和访问日期

Step 2: 交叉验证
  └─ 对比自己的官方政策 vs 第三方汇总
  └─ 检查与现有 regulation 页面的一致性
  └─ 如不一致，以官方来源为准

Step 3: 标注不确定内容
  └─ 对于无法确认的信息，添加警告标注
  └─ 格式: "[Note: This policy detail could not be independently verified as of [date]. Please confirm with [platform] official seller center.]"

Step 4: 记录来源
  └─ 在数据文件中注释每个数据点的来源 URL
  └─ 建立来源追溯表（见下文）
```

### 2.2 验证 Checklist

**必须通过的项目** (每个 platform×country 组合)：

- [ ] 平台官方卖家政策链接可访问（200 OK）
- [ ] 注册要求有官方文档支撑
- [ ] 费用结构有官方定价页支撑
- [ ] 化妆品政策引用具体政策文档
- [ ] 禁售/限制品类与官方 Restricted Products 列表一致
- [ ] ANVISA/COFEPRIS 要求与 `/regulation/*` 页面一致
- [ ] PTR 要求（Brazil）有官方来源
- [ ] NOM-141 引用（Mexico）正确
- [ ] 所有外部链接附带 `rel="nofollow noopener"`
- [ ] 页面底部有免责声明

---

## 三、数据建模规范

### 3.1 注释要求

每个数据字段必须有来源注释：

```typescript
// 示例：数据来源注释格式
export const amazonBrazil: PlatformCountryGuide = {
  // ...
  cosmeticsPolicy: {
    allowed: true,
    // Source: https://sell.amazon.com.br/... (accessed 2025-06-10)
    restrictions: ['...'],
    // Source: https://sell.amazon.com.br/... (accessed 2025-06-10)
    prohibitedCategories: ['...'],
  },
  // ...
}
```

### 3.2 来源追溯表（建议建立）

```
docs/platform-data-sources.md

| 平台 | 国家 | 数据点 | 官方来源 URL | 访问日期 | 验证人 |
|------|------|--------|------------|----------|--------|
| Amazon | Brazil | 卖家注册要求 | ... | 2025-06-10 | 运营经理 |
| Amazon | Brazil | 化妆品政策 | ... | 2025-06-10 | 运营经理 |
| ... | ... | ... | ... | ... | ... |
```

---

## 四、不确定内容处理

### 4.1 标注级别

| 级别 | 含义 | 处理方式 |
|------|------|----------|
| A - 确认 | 官方来源验证无误 | 正常展示 |
| B - 推断 | 官方来源间接支撑 | 展示 + 注释 |
| C - 不确定 | 无可靠来源 | 标注 + 引导用户核实 |

### 4.2 C 级内容的展示规范

```html
<div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
  <p class="text-sm text-yellow-800">
    <strong>Note:</strong> This specific policy detail could not be independently verified 
    as of June 2025. We recommend confirming directly with 
    <a href="[official-url]" rel="nofollow noopener" target="_blank">
      [Platform] Seller Center
    </a> 
    before making business decisions.
  </p>
</div>
```

---

## 五、更新维护计划

### 5.1 定期审查

| 频率 | 动作 | 责任人 |
|------|------|--------|
| 每季度 | 验证所有平台官方链接（200 OK） | 运营 |
| 每季度 | 检查政策变更是否影响内容 | 运营 |
| 每季度 | 更新页面 "last updated" 日期 | 开发 |
| 每年 | 全面数据审查和重新验证 | 运营 + 产品 |

### 5.2 政策变更响应

若收到用户反馈或官方政策变更通知：

1. 运营检查变更是否影响现有页面
2. 如有影响，创建 Jira/Trello 任务
3. 更新数据源文件
4. 更新页面 "last updated" 日期
5. 通知用户（如必要）

---

## 六、免责声明模板

每个 Platform 页面底部必须包含：

```html
<div class="border-t pt-6 mt-8">
  <p class="text-sm text-gray-500">
    Last updated: June 2025. Information sourced from official platform seller 
    policies and regulatory documents. Platform policies may change without notice. 
    Always verify current requirements directly with the platform's official seller 
    center before making business decisions. CosmetCheck is not affiliated with 
    any marketplace platform.
  </p>
</div>
```

---

## 七、QA 最终检查

在 Part A 上线前，必须完成：

- [ ] 所有官方链接已验证（200 OK）
- [ ] 所有不确定内容已标注
- [ ] 所有法规引用与 `/regulation/*` 页面一致
- [ ] 所有外部链接有 `rel="nofollow noopener"`
- [ ] 每页有免责声明
- [ ] 来源追溯表已完成
