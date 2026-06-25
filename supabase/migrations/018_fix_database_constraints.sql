-- ==========================================
-- 018_fix_database_constraints.sql
-- ==========================================

-- 1. Fix subscriptions status constraint
ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_status_check;
ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_status_check 
  CHECK (status IN ('active', 'past_due', 'canceled', 'trialing', 'incomplete', 'incomplete_expired', 'unpaid', 'paused'));

-- 2. Fix reports reported_type constraint
ALTER TABLE public.reports DROP CONSTRAINT IF EXISTS reports_reported_type_check;
ALTER TABLE public.reports ADD CONSTRAINT reports_reported_type_check 
  CHECK (reported_type IN ('profile', 'offer', 'ad', 'message', 'service', 'story', 'seat'));
