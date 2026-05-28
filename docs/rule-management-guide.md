# CosmetCheck 合规引擎规则管理规范

> 生效日期：2026-05-25
> 适用范围：所有修改、新增合规检测规则的团队成员

---

## 1. 规则来源优先级

引擎同时支持两种规则来源，优先级如下：

| 优先级 | 来源 | 位置 | 用途 |
|---------|------|------|------|
| P0 | JSON 规则 | `src/data/regulations/{brazil,mexico}/` | 主要规则集，支持动态更新、多语言、可配置 |
| P1 | 硬编码规则 | `src/lib/engine.ts` 中的 `ANVISA_RULES` / `COFEPRIS_RULES` | 仅用于内置基础规则或紧急修复（避免使用） |

**原则：所有新增规则必须走 JSON 规则渠道，禁止在 engine.ts 中新增硬编码规则。**

---

## 2. 新增 JSON 规则标准操作流程（SOP）

在新增或修改 `claims.json` / `banned.json` / `restricted.json` / `label.json` 中的规则时，必须执行以下步骤：

### Step 1：检查硬编码重复

在提交任何 JSON 规则之前，先检查 `engine.ts` 中的硬编码规则是否存在**语义重叠**。

判断重叠的标准：
- 目标违规类型相同（如都是"非法临床宣称"）
- aliases 列表有重叠（尤其是中文核心关键词）
- 覆盖的违规场景相同

**如果存在重叠，禁止直接提交。必须先完成 Step 2。**

### Step 2：合并独有 aliases

如果硬编码规则与新增 JSON 规则重叠：

1. 将硬编码规则中**不在 JSON 规则 aliases 中**的别名，全部迁移到 JSON 规则
2. 确保 JSON 规则的 aliases 覆盖硬编码规则的所有语言变体

### Step 3：移除硬编码规则

在确认 JSON 规则已完整吸收硬编码规则的 aliases 后，从 `engine.ts` 中删除该硬编码规则。

### Step 4：更新翻译

如果被移除的硬编码规则在 `regulation-messages.ts` 中有独立的翻译条目，一并移除（避免 orphaned translations）。

### Step 5：验证

- `npx tsc --noEmit` 编译通过
- `npx vitest run` 测试全部通过
- 手动验证新增 JSON 规则能够独立触发（不被硬编码规则遮挡）

---

## 3. 去重机制说明（关键风险点）

引擎在 `checkCompliance` 中有多层去重，其中第二层 `uniqueByMatch` 是导致 JSON 规则被“遮挡”的根源：

```typescript
const uniqueByMatch = new Map<string, Violation>()
for (const v of violations) {
  const key = `${v.category}:${(v.matchedText || v.keyword).toLowerCase()}`
  // 同一 category + 相同 matchedText 的不同 ruleId 会被去掉！
}
```

这意味着：如果两个不同的 `ruleId` 匹配到了**完全相同的文本**，只有一个会被保留。

**因此，必须消除硬编码/两套规则之间的语义重叠。**

---

## 4. 检查清单（Checklist）

提交前必须打勾：

- [ ] 检查 `engine.ts` 硬编码规则是否存在语义重叠（重点检查 aliases 列表）
- [ ] 如果有重叠，硬编码规则的所有独有 aliases 已迁移至 JSON 规则
- [ ] 硬编码重复规则已从 `engine.ts` 移除
- [ ] 对应的 `regulation-messages.ts` 翻译已清理
- [ ] `npx tsc --noEmit` 编译通过
- [ ] `npx vitest run src/lib/engine.test.ts` 测试通过
- [ ] 手动验证新规则能够触发（不被旧规则遮挡）

---

## 5. 示例

### 正确案例：新增 MX-CLAIM-024（非法临床宣称）

1. 发现 `engine.ts` 中已有 `MX-CLM-011` 也是临床宣称规则，且 aliases 高度重叠
2. 将 `MX-CLM-011` 独有的 5 个 PT 别名迁移到 `MX-CLAIM-024`
3. 从 `engine.ts` 删除 `MX-CLM-011`
4. 从 `regulation-messages.ts` 删除 `MX-CLM-011` 的翻译
5. 提交

### 错误案例（禁止）

1. 直接在 `claims.json` 新增 `MX-CLAIM-024`
2. 不检查 `engine.ts` 中是否已有 `MX-CLM-011`
3. 结果：两个规则 aliases 重叠，`uniqueByMatch` 去重后只保留一个，JSON 规则被遮挡

---

## 6. 联系人

如果对规则管理有疑问，请联系 CTO 确认方案后再执行。
