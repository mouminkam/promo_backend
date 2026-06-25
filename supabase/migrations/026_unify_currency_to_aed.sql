-- ==========================================
-- 026_unify_currency_to_aed.sql
-- ==========================================

-- Change default currency to AED for consistency with the Promoo Prototype

ALTER TABLE public.subscription_plans ALTER COLUMN currency SET DEFAULT 'AED';
ALTER TABLE public.payments ALTER COLUMN currency SET DEFAULT 'AED';
ALTER TABLE public.services ALTER COLUMN currency SET DEFAULT 'AED';
ALTER TABLE public.offers ALTER COLUMN currency SET DEFAULT 'AED';

-- Update existing rows that were inserted as 'usd' by default
UPDATE public.subscription_plans SET currency = 'AED' WHERE currency = 'usd' OR currency = 'USD';
UPDATE public.payments SET currency = 'AED' WHERE currency = 'usd' OR currency = 'USD';
UPDATE public.services SET currency = 'AED' WHERE currency = 'usd' OR currency = 'USD';
UPDATE public.offers SET currency = 'AED' WHERE currency = 'usd' OR currency = 'USD';
