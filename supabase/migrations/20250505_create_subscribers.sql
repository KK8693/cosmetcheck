-- 创建邮箱订阅者表
-- 执行方式：在 Supabase Dashboard -> SQL Editor -> New query 中粘贴执行

CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'footer_cta',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (email)
);

-- 启用 RLS（行级安全）
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- 允许匿名用户插入（仅限邮箱字段）
CREATE POLICY "Allow anonymous inserts" ON subscribers
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_created_at ON subscribers(created_at);

-- 设置复制解决方案（避免重复邮箱违约）
ALTER TABLE subscribers
  ADD CONSTRAINT subscribers_email_unique UNIQUE (email)
  ON CONFLICT DO NOTHING;