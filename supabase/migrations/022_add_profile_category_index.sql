-- ============================================
-- Migration: Add missing index on profiles table
-- ============================================

CREATE INDEX IF NOT EXISTS idx_profiles_category_id ON public.profiles(category_id);
