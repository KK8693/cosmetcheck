-- CosmetCheck Database Schema
-- Supabase PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase Auth)
CREATE TABLE public.users (
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

-- Regulations table (ANVISA/COFEPRIS rules)
CREATE TABLE public.regulations (
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

-- Products table
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    ingredients TEXT,
    description TEXT,
    country_target TEXT NOT NULL CHECK (country_target IN ('BR', 'MX', 'AR', 'CL', 'CO')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Checks table (合规检测记录)
CREATE TABLE public.checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    results_json JSONB NOT NULL,
    regulation_version INTEGER NOT NULL DEFAULT 1,
    is_compliant BOOLEAN,
    issues_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Listings table (AI 生成的内容)
CREATE TABLE public.listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    language TEXT NOT NULL CHECK (language IN ('pt-br', 'es-mx', 'es-co', 'es-ar', 'es-cl', 'en')),
    generated_content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Regulation versions table (for version control)
CREATE TABLE public.regulation_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    version INTEGER NOT NULL UNIQUE,
    effective_date DATE NOT NULL,
    changelog TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_regulations_country ON public.regulations(country);
CREATE INDEX idx_regulations_category ON public.regulations(category);
CREATE INDEX idx_regulations_keyword ON public.regulations(keyword);
CREATE INDEX idx_products_user_id ON public.products(user_id);
CREATE INDEX idx_checks_product_id ON public.checks(product_id);
CREATE INDEX idx_listings_product_id ON public.listings(product_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regulation_versions ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users: users can read their own data, admins can read all
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Regulations: public read for all authenticated users
CREATE POLICY "Authenticated users can view regulations" ON public.regulations
    FOR SELECT TO authenticated USING (is_active = true);

-- Products: users can CRUD their own products
CREATE POLICY "Users can view own products" ON public.products
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create products" ON public.products
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own products" ON public.products
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own products" ON public.products
    FOR DELETE USING (auth.uid() = user_id);

-- Checks: users can CRUD their own checks
CREATE POLICY "Users can view own checks" ON public.checks
    FOR SELECT USING (
        product_id IN (SELECT id FROM public.products WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can create checks" ON public.checks
    FOR INSERT WITH CHECK (
        product_id IN (SELECT id FROM public.products WHERE user_id = auth.uid())
    );

-- Listings: users can CRUD their own listings
CREATE POLICY "Users can view own listings" ON public.listings
    FOR SELECT USING (
        product_id IN (SELECT id FROM public.products WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can create listings" ON public.listings
    FOR INSERT WITH CHECK (
        product_id IN (SELECT id FROM public.products WHERE user_id = auth.uid())
    );

-- Regulation versions: public read
CREATE POLICY "Anyone can view regulation versions" ON public.regulation_versions
    FOR SELECT TO authenticated USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_regulations_updated_at BEFORE UPDATE ON public.regulations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial regulation version
INSERT INTO public.regulation_versions (version, effective_date, changelog)
VALUES (1, CURRENT_DATE, 'Initial version - ANVISA and COFEPRIS rules');

-- Function to check user quota
CREATE OR REPLACE FUNCTION check_user_quota(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    user_record RECORD;
BEGIN
    SELECT * INTO user_record 
    FROM public.users 
    WHERE id = user_uuid;
    
    IF user_record.subscription_tier = 'free' THEN
        RETURN user_record.quota_used < user_record.quota_limit;
    END IF;
    
    -- Pro and Team users have unlimited quota
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;