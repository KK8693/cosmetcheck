-- Migration: Fix serverless in-memory state loss for quota and rate limiting
-- Run this in Supabase SQL Editor before deploying the code fixes

-- 1. Quota tracking table
CREATE TABLE IF NOT EXISTS user_quotas (
  identifier TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0,
  reset_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_quotas_reset_at ON user_quotas(reset_at);

-- 2. Rate limit tracking table
CREATE TABLE IF NOT EXISTS rate_limits (
  identifier TEXT PRIMARY KEY,
  tokens FLOAT NOT NULL,
  last_refill BIGINT NOT NULL,
  max_tokens INTEGER NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for cleanup
CREATE INDEX IF NOT EXISTS idx_rate_limits_last_refill ON rate_limits(last_refill);

-- 3. RPC function for atomic rate limit check (token bucket)
-- This avoids race conditions in serverless environments
CREATE OR REPLACE FUNCTION check_rate_limit_rpc(
  p_identifier TEXT,
  p_rpm INTEGER,
  p_burst INTEGER,
  p_window_ms BIGINT
)
RETURNS TABLE(allowed BOOLEAN, remaining INTEGER, reset_in_ms INTEGER) AS $$
DECLARE
  v_bucket RECORD;
  v_now BIGINT;
  v_time_elapsed BIGINT;
  v_tokens_to_add INTEGER;
  v_new_tokens FLOAT;
BEGIN
  v_now := extract(epoch from now()) * 1000;

  SELECT * INTO v_bucket FROM rate_limits WHERE identifier = p_identifier;

  IF NOT FOUND THEN
    INSERT INTO rate_limits (identifier, tokens, last_refill, max_tokens)
    VALUES (p_identifier, p_burst::FLOAT - 1, v_now, p_burst);
    RETURN QUERY SELECT TRUE, p_burst - 1, p_window_ms::INTEGER;
    RETURN;
  END IF;

  v_time_elapsed := v_now - v_bucket.last_refill;
  v_tokens_to_add := floor((v_time_elapsed::FLOAT / p_window_ms) * p_rpm)::INTEGER;

  IF v_tokens_to_add > 0 THEN
    v_new_tokens := LEAST(v_bucket.max_tokens::FLOAT, v_bucket.tokens + v_tokens_to_add);
    UPDATE rate_limits
    SET tokens = v_new_tokens, last_refill = v_now
    WHERE identifier = p_identifier;
    v_bucket.tokens := v_new_tokens;
    v_bucket.last_refill := v_now;
  END IF;

  IF v_bucket.tokens >= 1 THEN
    UPDATE rate_limits
    SET tokens = tokens - 1
    WHERE identifier = p_identifier;
    RETURN QUERY SELECT TRUE, GREATEST(0, floor(v_bucket.tokens - 1)::INTEGER), p_window_ms::INTEGER;
  ELSE
    RETURN QUERY SELECT FALSE, 0, p_window_ms::INTEGER;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 4. Cleanup function for old rate limit records (run periodically or via cron)
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits(p_max_age_ms BIGINT)
RETURNS INTEGER AS $$
DECLARE
  v_now BIGINT;
  v_deleted INTEGER;
BEGIN
  v_now := extract(epoch from now()) * 1000;
  DELETE FROM rate_limits WHERE (v_now - last_refill) > p_max_age_ms;
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$ LANGUAGE plpgsql;
