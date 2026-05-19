# CosmetCheck 数据库部署指南

## 执行位置
**Supabase Dashboard → SQL Editor → New query**

## 执行顺序（必须按顺序执行）

### 第1步：创建核心表 (01_core_tables.sql)
- 创建 `public.users` 表 ← **这是导致登录失败的表！**
- 创建 `public.regulations` 表
- 创建 `public.products` 表
- 创建 `public.checks` 表
- 创建 `public.listings` 表
- 创建 `public.regulation_versions` 表
- 插入初始规则数据（ANVISA/COFEPRIS）

### 第2步：配置安全策略 (02_rls_policies.sql)
- 启用 Row Level Security (RLS)
- 配置各表的访问策略

### 第3步：创建触发器 (03_triggers_functions.sql)
- 自动更新 `updated_at` 时间戳
- **关键**：新用户注册时自动在 `public.users` 表创建记录
- 用户配额检查函数

### 第4步：扩展功能表 (04_extended_tables.sql)
- `subscribers` - 邮箱订阅
- `dispute_reports` - 误检争议报告
- `batch_tasks` - 批量任务
- `batch_results` - 批量结果

---

## 验证部署成功

部署完成后，在 Supabase SQL Editor 中运行：

```sql
-- 检查表是否创建成功
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

应该看到：
- users
- regulations  
- products
- checks
- listings
- regulation_versions
- subscribers
- dispute_reports
- batch_tasks
- batch_results

---

## 测试登录/注册流程

1. 打开 https://cosmetcheck.pages.dev
2. 点击 "Get Started Free"
3. 尝试注册新用户
4. 注册成功后应能正常登录（不再报 404 错误）

---

## 文件位置

```
supabase/deploy_sql/
├── 01_core_tables.sql      # 核心表结构
├── 02_rls_policies.sql     # 安全策略
├── 03_triggers_functions.sql  # 触发器和函数
├── 04_extended_tables.sql  # 扩展功能表
└── README.md              # 本文件
```