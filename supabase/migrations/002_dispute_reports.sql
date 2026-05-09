-- 误检/争议报告表
-- 执行方式：在 Supabase Dashboard -> SQL Editor -> New query 中粘贴执行

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

-- 启用 RLS
ALTER TABLE dispute_reports ENABLE ROW LEVEL SECURITY;

-- 允许匿名用户提交报告
CREATE POLICY "Allow anonymous inserts" ON dispute_reports
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 允许读取自己的报告
CREATE POLICY "Users can read own reports" ON dispute_reports
  FOR SELECT
  TO anon
  USING (user_email = null OR user_email = current_setting('request.jwt.claims.email', true));

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_dispute_reports_status ON dispute_reports(status);
CREATE INDEX IF NOT EXISTS idx_dispute_reports_rule_id ON dispute_reports(rule_id);
CREATE INDEX IF NOT EXISTS idx_dispute_reports_created_at ON dispute_reports(created_at DESC);