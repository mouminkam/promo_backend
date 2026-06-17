-- ==========================================
-- 010_add_is_active_to_profiles.sql
-- ==========================================

-- Add the missing is_active column for the User Ban feature
alter table public.profiles add column if not exists is_active boolean default true;
