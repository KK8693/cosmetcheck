-- ============================================================
-- 第3步：触发器和函数 (03_triggers_functions.sql)
-- ============================================================

-- 更新时间戳的函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为各表创建 updated_at 触发器
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_regulations_updated_at ON public.regulations;
CREATE TRIGGER update_regulations_updated_at BEFORE UPDATE ON public.regulations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 检查用户配额的函数
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
    
    -- Pro 和 Team 用户无限配额
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 自动创建用户记录的触发器（注册时自动在 users 表创建记录）
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, subscription_tier, quota_limit)
    VALUES (NEW.id, NEW.email, 'free', 10)
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器：在 auth.users 表创建新用户时自动在 public.users 表创建记录
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ✅ 第3步完成