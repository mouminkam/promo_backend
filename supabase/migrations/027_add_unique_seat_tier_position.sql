-- ==========================================
-- 027_add_unique_seat_tier_position.sql
-- ==========================================

-- Add unique constraint to prevent duplicate seats
ALTER TABLE public.seats ADD CONSTRAINT seats_tier_position_key UNIQUE (tier, position);
