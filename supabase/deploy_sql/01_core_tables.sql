-- ============================================================
-- CosmetCheck 数据库部署脚本
-- 执行顺序：01 → 02 → 03 → 04
-- 执行方式：Supabase Dashboard → SQL Editor → 逐个执行
-- ============================================================

-- ============================================================
-- 第1步：核心表结构 (01_core_tables.sql)
-- ============================================================

-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users 表（扩展 Supabase Auth）
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'team')),
    quota_used INTEGER DEFAULT 0,
    quota_limit INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Regulations 表（ANVISA/COFEPRIS 规则）
CREATE TABLE IF NOT EXISTS public.regulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country TEXT NOT NULL CHECK (country IN ('BR', 'MX', 'AR', 'CL', 'CO')),
    category TEXT NOT NULL CHECK (category IN ('ingredient', 'label', 'claim', 'packaging')),
    rule_type TEXT NOT NULL CHECK (rule_type IN ('prohibited', 'restricted', 'required', 'allowed')),
    keyword TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('critical', 'warning', 'info')),
    suggestion TEXT,
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products 表
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    ingredients TEXT,
    description TEXT,
    country_target TEXT NOT NULL CHECK (country_target IN ('BR', 'MX', 'AR', 'CL', 'CO')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Checks 表（合规检测记录）
CREATE TABLE IF NOT EXISTS public.checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    results_json JSONB NOT NULL,
    regulation_version INTEGER NOT NULL DEFAULT 1,
    is_compliant BOOLEAN,
    issues_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Listings 表（AI 生成的内容）
CREATE TABLE IF NOT EXISTS public.listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    language TEXT NOT NULL CHECK (language IN ('pt-br', 'es-mx', 'es-co', 'es-ar', 'es-cl', 'en')),
    generated_content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Regulation versions 表
CREATE TABLE IF NOT EXISTS public.regulation_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    version INTEGER NOT NULL UNIQUE,
    effective_date DATE NOT NULL,
    changelog TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_regulations_country ON public.regulations(country);
CREATE INDEX IF NOT EXISTS idx_regulations_category ON public.regulations(category);
CREATE INDEX IF NOT EXISTS idx_regulations_keyword ON public.regulations(keyword);
CREATE INDEX IF NOT EXISTS idx_products_user_id ON public.products(user_id);
CREATE INDEX IF NOT EXISTS idx_checks_product_id ON public.checks(product_id);
CREATE INDEX IF NOT EXISTS idx_listings_product_id ON public.listings(product_id);

-- 插入初始 regulation version
INSERT INTO public.regulation_versions (version, effective_date, changelog)
VALUES (1, CURRENT_DATE, 'Initial version - ANVISA and COFEPRIS rules')
ON CONFLICT (version) DO NOTHING;

-- 插入初始规则数据
INSERT INTO public.regulations (country, category, rule_type, keyword, severity, suggestion, version, is_active) VALUES
    ('BR', 'ingredient', 'prohibited', 'mercury', 'critical', 'Remove mercury compounds from the formula.', 1, TRUE),
    ('BR', 'ingredient', 'prohibited', 'lead', 'critical', 'Remove lead and its compounds from the formula.', 1, TRUE),
    ('BR', 'ingredient', 'prohibited', 'hydroquinone', 'critical', 'Remove hydroquinone or reformulate as a pharmaceutical product.', 1, TRUE),
    ('BR', 'ingredient', 'prohibited', 'corticosteroid', 'critical', 'Remove corticosteroids - product must be registered as medicine.', 1, TRUE),
    ('BR', 'ingredient', 'prohibited', 'formaldehyde', 'critical', 'Ensure formaldehyde concentration is below 0.2% or remove entirely.', 1, TRUE),
    ('BR', 'ingredient', 'restricted', 'paraben', 'warning', 'Verify total paraben concentration does not exceed 0.4% for single / 0.8% for mixtures.', 1, TRUE),
    ('BR', 'ingredient', 'restricted', 'retinol', 'warning', 'Ensure retinol concentration does not exceed regulatory limits.', 1, TRUE),
    ('BR', 'claim', 'prohibited', 'medicinal', 'critical', 'Remove terms like "treats", "cures", "medicinal" from product claims.', 1, TRUE),
    ('BR', 'claim', 'prohibited', 'cure', 'critical', 'Use cosmetic claims only (moisturizing, cleansing, beautifying).', 1, TRUE),
    ('BR', 'claim', 'prohibited', '100% natural', 'warning', 'Remove absolute claims unless certified. Use "contains natural ingredients" instead.', 1, TRUE),
    ('BR', 'label', 'required', 'manufacturer', 'warning', 'Add manufacturer name, CNPJ, and complete address to the label.', 1, TRUE),
    ('BR', 'label', 'required', 'ingredient list', 'warning', 'Include full ingredient list in INCI standard format.', 1, TRUE),
    ('BR', 'label', 'required', 'ANVISA registration', 'info', 'Obtain ANVISA registration before commercialization.', 1, TRUE),
    ('MX', 'ingredient', 'prohibited', 'mercury', 'critical', 'Remove mercury compounds from the formula.', 1, TRUE),
    ('MX', 'ingredient', 'prohibited', 'lead', 'critical', 'Remove lead and its compounds.', 1, TRUE),
    ('MX', 'ingredient', 'prohibited', 'hydroquinone', 'critical', 'Remove hydroquinone or register as pharmaceutical product.', 1, TRUE),
    ('MX', 'ingredient', 'prohibited', 'corticosteroid', 'critical', 'Remove corticosteroids - product must be registered as medicine.', 1, TRUE),
    ('MX', 'ingredient', 'prohibited', 'formaldehyde', 'critical', 'Ensure formaldehyde is not used as an ingredient.', 1, TRUE),
    ('MX', 'ingredient', 'restricted', 'paraben', 'warning', 'Verify paraben concentrations comply with NOM limits.', 1, TRUE),
    ('MX', 'ingredient', 'restricted', 'retinol', 'warning', 'Ensure retinol concentration is within allowed limits.', 1, TRUE),
    ('MX', 'claim', 'prohibited', 'medicinal', 'critical', 'Remove therapeutic claims. Use cosmetic claims only.', 1, TRUE),
    ('MX', 'claim', 'prohibited', 'cure', 'critical', 'Remove disease-related claims.', 1, TRUE),
    ('MX', 'label', 'required', 'manufacturer', 'warning', 'Add manufacturer name and address in Spanish.', 1, TRUE),
    ('MX', 'label', 'required', 'ingredient list', 'warning', 'Include full ingredient list in INCI standard format.', 1, TRUE),
    ('MX', 'label', 'required', 'COFEPRIS registration', 'info', 'Obtain COFEPRIS registration before commercialization.', 1, TRUE)
ON CONFLICT DO NOTHING;

-- ✅ 第1步完成