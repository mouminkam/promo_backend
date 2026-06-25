-- Migration 031: Cleanup duplicate RLS policies + add missing category index

-- 1. Remove duplicate admin policies on offers (keep the cleaner named one)
DROP POLICY IF EXISTS "Admins can manage all ads and offers." ON public.offers;

-- 2. Remove duplicate admin policies on subscription_plans (keep the cleaner named one)
DROP POLICY IF EXISTS "Admins can manage subscription plans." ON public.subscription_plans;

-- 3. Add missing profiles category_id index
CREATE INDEX IF NOT EXISTS idx_profiles_category_id ON public.profiles(category_id);
