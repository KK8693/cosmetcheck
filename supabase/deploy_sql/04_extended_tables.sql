-- ============================================================
-- 第4步：扩展功能表 (04_extended_tables.sql)
-- ============================================================

-- ----------------------------
-- 4.1 邮箱订阅表 (subscribers)
-- ----------------------------
CREATE TABLE IF NOT EXISTS subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT 'footer_cta',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (email)
);

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous subscriber inserts" ON subscribers;
CREATE POLICY "Allow anonymous subscriber inserts" ON subscribers
    FOR INSERT TO anon WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_created_at ON subscribers(created_at);

-- ----------------------------
-- 4.2 误检争议报告表 (dispute_reports)
-- ----------------------------
CREATE TABLE IF NOT EXISTS dispute_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT,
    country TEXT NOT NULL CHECK (country IN ('BR', 'MX')),
    rule_id TEXT NOT NULL,
    original_input TEXT NOT NULL,
    user_reason TEXT NOT NULL,
    expected_result TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE dispute_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous dispute inserts" ON dispute_reports;
CREATE POLICY "Allow anonymous dispute inserts" ON dispute_reports
    FOR INSERT TO anon WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_dispute_reports_status ON dispute_reports(status);
CREATE INDEX IF NOT EXISTS idx_dispute_reports_rule_id ON dispute_reports(rule_id);
CREATE INDEX IF NOT EXISTS idx_dispute_reports_created_at ON dispute_reports(created_at DESC);

-- dispute_reports updated_at 触发器
DROP TRIGGER IF EXISTS update_dispute_reports_updated_at ON dispute_reports;
CREATE TRIGGER update_dispute_reports_updated_at BEFORE UPDATE ON dispute_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------
-- 4.3 批量任务表 (batch_tasks)
-- ----------------------------
CREATE TABLE IF NOT EXISTS batch_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    task_type VARCHAR(20) NOT NULL CHECK (task_type IN ('detect', 'generate')),
    total_count INTEGER NOT NULL DEFAULT 0,
    completed_count INTEGER DEFAULT 0,
    passed_count INTEGER DEFAULT 0,
    failed_count INTEGER DEFAULT 0,
    critical_count INTEGER DEFAULT 0,
    warning_count INTEGER DEFAULT 0,
    info_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- ----------------------------
-- 4.4 批量结果表 (batch_results)
-- ----------------------------
CREATE TABLE IF NOT EXISTS batch_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES batch_tasks(id) ON DELETE CASCADE,
    row_index INTEGER NOT NULL,
    product_id VARCHAR(100),
    original_text TEXT NOT NULL,
    country VARCHAR(10) NOT NULL CHECK (country IN ('BR', 'MX', 'AR', 'CL', 'CO')),
    is_compliant BOOLEAN DEFAULT true,
    violations JSONB DEFAULT '[]'::jsonb,
    compliant_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 批量表索引
CREATE INDEX IF NOT EXISTS idx_batch_tasks_user_id ON batch_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_batch_tasks_status ON batch_tasks(status);
CREATE INDEX IF NOT EXISTS idx_batch_results_task_id ON batch_results(task_id);

-- 批量表 RLS
ALTER TABLE batch_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE batch_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own batch tasks" ON batch_tasks;
DROP POLICY IF EXISTS "Users can create batch tasks" ON batch_tasks;
DROP POLICY IF EXISTS "Users can update own batch tasks" ON batch_tasks;
DROP POLICY IF EXISTS "Users can view own batch results" ON batch_results;
DROP POLICY IF EXISTS "Users can create batch results" ON batch_results;

CREATE POLICY "Users can view own batch tasks" ON batch_tasks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create batch tasks" ON batch_tasks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own batch tasks" ON batch_tasks
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own batch results" ON batch_results
    FOR SELECT USING (
        task_id IN (SELECT id FROM batch_tasks WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can create batch results" ON batch_results
    FOR INSERT WITH CHECK (
        task_id IN (SELECT id FROM batch_tasks WHERE user_id = auth.uid())
    );

-- ✅ 第4步完成
-- ✅ 数据库部署完成！