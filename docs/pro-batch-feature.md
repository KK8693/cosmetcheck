# Pro 批量功能任务计划

## 任务概述
面向高频、大批量合规需求：一次处理 100~10000 条商品文案，自动检测 → 批量报表 → 一键生成合规文案 → 导出上架。

## 功能清单

### P0 核心功能
1. **批量检测**
   - 文本批量粘贴（每行 = 1 条文案）
   - Excel/CSV 表格导入
   - OpenAPI 批量推送（Pro 专属）

2. **异步任务处理**
   - 任务队列（Redis + Bull）
   - 进度实时推送（WebSocket 或轮询）
   - 完成后通知（站内信）

3. **结果展示**
   - 汇总统计：总文案数、合规数、不合规数、按国家/严重程度分布
   - 明细列表：商品ID、原文案、违规等级、违规关键词、命中规则
   - 筛选/搜索

4. **导出报告**
   - Excel 完整版：商品ID、原文案、检测结果、违规详情、法规依据、修改建议

### P1 批量生成
1. **自动修复违规文案**
   - 精准替换：只修改违规词汇，保留原文结构
   - 双语适配：巴西葡语、墨西哥西语
   - 分级修复：critical > warning > info

2. **高级功能**
   - 批量套用模板
   - 生成后二次校验
   - 原文 ↔️ 合规文对比

3. **导出合规文案**
   - 商品ID + 原文案 + 合规文案（葡/西）+ 备注

### P2 增值功能
1. 国家批量指定：仅巴西 / 仅墨西哥 / 双国家
2. API 接口：Pro 用户专属 API Key

## 技术架构

```
┌─────────────────────────────────────────┐
│           前端 (Next.js)                │
│  /batch → 批量检测页面                  │
│  /batch/generate → 批量生成页面         │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│         API Routes (Next.js)            │
│  POST /api/batch/detect                 │
│  GET  /api/batch/task/{id}              │
│  POST /api/batch/generate               │
│  GET  /api/batch/export/{id}            │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│      任务队列 (Redis + Bull)            │
│  - 任务入队 → 分片处理                   │
│  - 进度存储 Redis Hash                  │
│  - 完成后通知                            │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│      复用现有检测引擎                   │
│  RegulationLoader + Matcher            │
└─────────────────────────────────────────┘
```

## 数据库设计

```sql
-- 批量任务表
CREATE TABLE batch_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  task_type VARCHAR(20) NOT NULL, -- 'detect' | 'generate'
  total_count INTEGER NOT NULL,
  completed_count INTEGER DEFAULT 0,
  passed_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- 批量任务结果表
CREATE TABLE batch_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES batch_tasks(id),
  row_index INTEGER NOT NULL,
  product_id VARCHAR(100),
  original_text TEXT NOT NULL,
  country VARCHAR(10) NOT NULL,
  is_compliant BOOLEAN DEFAULT true,
  violations JSONB,
  compliant_text TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_batch_tasks_user ON batch_tasks(user_id);
CREATE INDEX idx_batch_results_task ON batch_results(task_id);
```

## 量级限制

| 用户类型 | 单次上限 | API 限制 |
|----------|----------|----------|
| 免费用户 | 不可用 | - |
| Pro 月付 | 50 条/次 | 100 条/分钟 |
| Pro 年付 | 1000 条/次 | 500 条/分钟 |

## 待开发文件结构

```
src/
├── app/
│   ├── batch/
│   │   ├── page.tsx          # 批量首页
│   │   ├── detect/page.tsx   # 批量检测
│   │   └── generate/page.tsx # 批量生成
│   └── api/
│       └── batch/
│           ├── detect/route.ts
│           ├── task/route.ts
│           ├── generate/route.ts
│           └── export/route.ts
├── lib/
│   └── batch/
│       ├── queue.ts
│       ├── processor.ts
│       ├── detector.ts
│       └── generator.ts
└── components/
    └── batch/
        ├── BatchInput.tsx
        ├── ProgressBar.tsx
        ├── ResultsTable.tsx
        └── ExportButton.tsx
```

## 关键词匹配优化建议（用户建议，待评估）

1. **三层匹配**：
   - 层级1：短语精确匹配（≥3词）
   - 层级2：完整独立单词匹配
   - 层级3：词根/变形匹配

2. **文本预处理**：
   - 转小写
   - 去除重音符号
   - 移除标点

3. **误判规避**：
   - 2字符以内单词不单独匹配
   - 白名单豁免
   - 上下文弱匹配

---

**创建时间**: 2026-05-09
**状态**: 等待开发
**优先级**: P0