-- ==========================================
-- 012_add_currency_to_plans.sql
-- ==========================================

alter table public.subscription_plans 
add column currency text default 'usd' not null;
