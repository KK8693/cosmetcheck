-- M1b: Email automation infrastructure
-- Create tables for email logging and abandoned checkout tracking

-- Email send log (prevents duplicate sends)
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  to_email TEXT NOT NULL,
  template TEXT NOT NULL,
  subject TEXT NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  provider_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_logs_to_email ON email_logs(to_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_template ON email_logs(template);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at);

-- Abandoned checkout tracking
CREATE TABLE IF NOT EXISTS abandoned_checkouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  plan TEXT NOT NULL DEFAULT 'monthly',
  locale TEXT NOT NULL DEFAULT 'en',
  abandoned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  recovered BOOLEAN NOT NULL DEFAULT false,
  recovered_at TIMESTAMPTZ,
  step_sent INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_abandoned_checkouts_email ON abandoned_checkouts(email);
CREATE INDEX IF NOT EXISTS idx_abandoned_checkouts_recovered ON abandoned_checkouts(recovered);
CREATE INDEX IF NOT EXISTS idx_abandoned_checkouts_step_sent ON abandoned_checkouts(step_sent);

-- Enable RLS
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE abandoned_checkouts ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (Edge Runtime uses service role)
CREATE POLICY "Service role full access email_logs"
  ON email_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access abandoned_checkouts"
  ON abandoned_checkouts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Anonymous can only insert abandoned_checkouts (from frontend)
CREATE POLICY "Allow anon insert abandoned_checkouts"
  ON abandoned_checkouts
  FOR INSERT
  TO anon
  WITH CHECK (true);
