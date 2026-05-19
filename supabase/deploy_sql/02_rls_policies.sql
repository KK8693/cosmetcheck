-- ============================================================
-- 第2步：RLS 安全策略 (02_rls_policies.sql)
-- ============================================================

-- 启用 Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regulation_versions ENABLE ROW LEVEL SECURITY;

-- Users RLS 策略
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;

CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Regulations RLS 策略（公开可读）
DROP POLICY IF EXISTS "Anyone can view regulations" ON public.regulations;
CREATE POLICY "Anyone can view regulations" ON public.regulations
    FOR SELECT TO authenticated USING (is_active = true);

-- Products RLS 策略
DROP POLICY IF EXISTS "Users can view own products" ON public.products;
DROP POLICY IF EXISTS "Users can create products" ON public.products;
DROP POLICY IF EXISTS "Users can update own products" ON public.products;
DROP POLICY IF EXISTS "Users can delete own products" ON public.products;

CREATE POLICY "Users can view own products" ON public.products
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create products" ON public.products
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own products" ON public.products
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own products" ON public.products
    FOR DELETE USING (auth.uid() = user_id);

-- Checks RLS 策略
DROP POLICY IF EXISTS "Users can view own checks" ON public.checks;
DROP POLICY IF EXISTS "Users can create checks" ON public.checks;

CREATE POLICY "Users can view own checks" ON public.checks
    FOR SELECT USING (
        product_id IN (SELECT id FROM public.products WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can create checks" ON public.checks
    FOR INSERT WITH CHECK (
        product_id IN (SELECT id FROM public.products WHERE user_id = auth.uid())
    );

-- Listings RLS 策略
DROP POLICY IF EXISTS "Users can view own listings" ON public.listings;
DROP POLICY IF EXISTS "Users can create listings" ON public.listings;

CREATE POLICY "Users can view own listings" ON public.listings
    FOR SELECT USING (
        product_id IN (SELECT id FROM public.products WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can create listings" ON public.listings
    FOR INSERT WITH CHECK (
        product_id IN (SELECT id FROM public.products WHERE user_id = auth.uid())
    );

-- Regulation versions 公开可读
DROP POLICY IF EXISTS "Anyone can view regulation versions" ON public.regulation_versions;
CREATE POLICY "Anyone can view regulation versions" ON public.regulation_versions
    FOR SELECT TO authenticated USING (true);

-- ✅ 第2步完成