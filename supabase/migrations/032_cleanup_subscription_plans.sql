-- Migration 032: Remove duplicate/placeholder subscription plans
-- Keep only plans with real Stripe IDs (price_1TlHA...) — these actually work with Stripe.
-- Delete placeholder plans (price_*_placeholder) and inactive Enterprise plan.

DELETE FROM public.subscription_plans
WHERE stripe_price_id IN (
  'price_basic_monthly_placeholder',
  'price_standard_monthly_placeholder',
  'price_premium_monthly_placeholder',
  'price_1TlHAh62ag8Shm9RqNeUdKWW'  -- Enterprise 290 AED, is_active = false
);
