-- ============================================
-- 024: Fix Feature Offer Payment Type
-- ============================================

-- Fix the Webhook Crash for the feature_offer type
ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_type_check;
ALTER TABLE public.payments ADD CONSTRAINT payments_type_check 
  CHECK (type IN ('subscription', 'ad', 'featured', 'seat_booking', 'feature_offer'));
