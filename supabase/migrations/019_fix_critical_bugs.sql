-- ============================================
-- 019: Fix Critical Database Bugs
-- ============================================

-- 1. Add 'seat_booking' to payments type CHECK constraint
ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_type_check;
ALTER TABLE public.payments ADD CONSTRAINT payments_type_check 
  CHECK (type IN ('subscription', 'ad', 'featured', 'seat_booking'));

-- 2. Add missing storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('services', 'services', true),
  ('stories', 'stories', true),
  ('verifications', 'verifications', false),
  ('reports', 'reports', false)
ON CONFLICT (id) DO NOTHING;

-- Policies for public reading of services and stories
CREATE POLICY "Public Access for Services and Stories"
ON storage.objects FOR SELECT TO public
USING ( bucket_id IN ('services', 'stories') );

-- Policies for private reading of verifications and reports
CREATE POLICY "Users can read their own private media"
ON storage.objects FOR SELECT TO authenticated
USING ( 
  bucket_id IN ('verifications', 'reports') 
  AND auth.uid()::text = (storage.foldername(name))[1] 
);

-- Policies for uploading to the new buckets
CREATE POLICY "Authenticated Users can Upload to new buckets"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK ( bucket_id IN ('services', 'stories', 'verifications', 'reports') );

-- Note: UPDATE and DELETE policies created in 016 apply globally to all 
-- objects where the foldername matches auth.uid(). No need to recreate them.

-- 3. Add UPDATE policy for users on seats table
-- We use 'influencer_id IS NULL OR auth.uid() = influencer_id' for both 
-- USING and WITH CHECK so that users can book available seats (where influencer_id is null) 
-- AND they can cancel them (setting influencer_id back to null).
CREATE POLICY "Influencers can update their own seat."
ON public.seats FOR UPDATE
USING (influencer_id IS NULL OR auth.uid() = influencer_id)
WITH CHECK (influencer_id IS NULL OR auth.uid() = influencer_id);
