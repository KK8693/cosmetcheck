# CosmetCheck 检测结果改进追踪

> 创建时间: 2025-05-20
> 基于: 西班牙语产品描述 ANVISA/COFEPRIS 双法规检测结果深度评审

---

## 测试样本

**产品名**: Suero Blanqueador Eliminador de Manchas Efectivo Rápido
**描述**: Este suero de grado médico elimina todas las manchas faciales y melasma en solo 7 días, cura por completo la acumulación de melanina y logra un blanqueamiento permanente de la piel. Es seguro para mujeres embarazadas y piel sensible, logra un efecto ideal al 100%, no produce ningún efecto secundario ni irritación cutánea. Bloquea eficazmente los rayos ultravioleta y mantiene la piel luminosa de forma duradera.
**成分**: Agua, Glicerina, Hidroquinona, Extracto de hormona vegetal, Esencia hidratante, Fragancia, Conservante potente

---

## 🔴 P0 — 阻塞商用（本周必须修复）

### 1. 消除植物激素误报（BR + MX）
- **问题**: `Extracto de hormona vegetal` 被误判为皮质类固醇
- **根因**:  aliases 中 "hormona" / "激素" 匹配过于宽泛，未区分植物源 vs 药用激素
- **修复方向**:
  - 在 `BR-ING-004` / `MX-ING-004` 的匹配逻辑中增加负向过滤：排除含 "vegetal"/"植物" 前缀的别名
  - 或：将 `Extracto de hormona vegetal` 从 corticosteroid 规则中移除，单独处理

### 2. 补充绝对安全宣称检测（BR + MX）
- **漏报**: "no produce ningún efecto secundario ni irritación cutánea"（零副作用+零刺激）
- **法规依据**:
  - 巴西 IN 26/2022: 禁止 "zero risk", "never causes sensitization"
  - 墨西哥 COFEPRIS: 禁止 "sin riesgo", "nunca causa alergias"
- **修复方向**: 新增规则 `BR-ABS-004` / `MX-CLAIM-004`
  - aliases: `ningún efecto secundario`, `sin efectos secundarios`, `no irrita`, `sin irritación`, `零副作用`, `无副作用`, `无刺激`, `绝不致敏`, `sem efeitos colaterais`, `não irrita`

### 3. 完成西班牙语翻译 100%
- **现状**: 巴西结果中英文+西语混杂；墨西哥结果仍有英文残留
- **待翻译条目**（`esRegulations` 中仍为英文的 key）:
  - `BR-CLAIM-014` / `MX-CLAIM-014` → Fixed-day claims
  - `BR-CLAIM-015` / `MX-CLAIM-015` → Medical grade claims
  - `BR-POP-001` / `MX-CLAIM-016` → Special population claims
  - `BR-CLAIM-001` / `MX-CLAIM-010` → Cure/treat claims
  - `BR-CLM-003` / `MX-CLAIM-017` → Whitening claims
  - `BR-ABS-004`（新增）→ Absolute safety claims

---

## 🟡 P1 — 显著提升体验（2周内）

### 4. 产品名称纳入检测
- **现状**: `CheckInput` 只有 `ingredients`, `description`, `label`
- **漏检**: 产品名 `Suero Blanqueador Eliminador de Manchas Efectivo Rápido` 含多重违规
- **修复方向**: 新增 `productName?: string` 字段，独立检测并标注 `sourceField: 'productName'`

### 5. 前端高亮匹配文本
- **现状**: API 返回 `matchedText` 和 `position`，但前端未使用 `position` 高亮
- **修复方向**: 在结果展示中，将 `matchedText` 在原文中做高亮/下划线标注

### 6. 建议文案具体化
- **现状**: "Review claims to ensure compliance with ANVISA regulations." 过于笼统
- **目标**: 每条建议应给出"删除什么 + 替换为什么"的具体操作
- **示例**:
  - ❌ `Review claims to ensure compliance...`
  - ✅ `Elimine la frase "grado médico" y sustitúyala por "fórmula premium".`

---

## 🟢 P2 — 长期竞争力（1个月内）

### 7. 法规引用精确化
- **现状**: `ANVISA RDC 529/2021` 过于笼统
- **目标**: 精确到条款号（如 `RDC 529/2021 Art. 3º, §2º`）

### 8. 置信度/推测性标注
- **场景**: "Conservante potente" → 甲醛（间接推断）
- **目标**: 对非直接匹配标注 `confidence: 'inferred'`，降低 severity 或增加提示

### 9. 按违规类型分组展示
- **目标**: 前端按 category 分组
  ```
  🧪 成分违规 (2)
  ⚠️ 宣称违规 (5)
  🏷️ 标签缺失 (1)
  ```

### 10. 消除墨西哥甲醛误报
- **问题**: `Conservante potente` 被推断为甲醛释放体
- **修复方向**: 增加置信度逻辑，间接推断不直接触发 critical，仅给 warning + 提示

---

## 已验证的生产环境状态

- [x] 构建通过
- [x] Cloudflare Pages 部署完成 (`preview` 分支)
- [x] Claims 规则已能正常触发（零触发问题已修复）
- [ ] 葡语环境待测试（`pt-BR` / `pt`）

---

## 备注

- 成分规则（氢醌）检测准确，无需改进
- 时效宣称（7天）检测准确
- 医疗级宣称检测准确
- 孕妇/特殊人群宣称检测准确
- 治愈/美白宣称检测准确
- **核心风险点：误报 > 漏报 > 翻译不完整**
