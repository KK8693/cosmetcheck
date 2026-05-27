-- Migration: Add analytics tracking fields to users table
-- Date: 2026-05-27
-- Purpose: Support GA4 custom dimensions (signup_source, first_referral_domain)

-- Add signup_source column if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'signup_source'
    ) THEN
        ALTER TABLE users ADD COLUMN signup_source VARCHAR(50);
    END IF;
END
$$;

-- Add first_referral_domain column if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'first_referral_domain'
    ) THEN
        ALTER TABLE users ADD COLUMN first_referral_domain VARCHAR(255);
    END IF;
END
$$;

-- Add preferred_language column if not exists (for analytics user properties)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'preferred_language'
    ) THEN
        ALTER TABLE users ADD COLUMN preferred_language VARCHAR(10) DEFAULT 'en';
    END IF;
END
$$;

-- Add last_active_at column if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'last_active_at'
    ) THEN
        ALTER TABLE users ADD COLUMN last_active_at TIMESTAMPTZ;
    END IF;
END
$$;

-- Create index on signup_source for analytics queries
CREATE INDEX IF NOT EXISTS idx_users_signup_source ON users(signup_source);
