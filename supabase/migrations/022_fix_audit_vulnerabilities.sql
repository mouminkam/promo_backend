-- ============================================
-- Promoo Backend — Migration 022
-- Fix Final Audit Vulnerabilities
-- ============================================

-- 1. Fix Seat Booking RLS Vulnerability
-- Problem: The old policy allowed any user to update empty seats because USING (influencer_id IS NULL).
-- Fix: Only allow the user who currently owns the seat to update it (for cancellation).
DROP POLICY IF EXISTS "Influencers can update their own seat." ON public.seats;

CREATE POLICY "Influencers can update their own seat."
ON public.seats FOR UPDATE
USING (auth.uid() = influencer_id)
WITH CHECK (auth.uid() = influencer_id OR influencer_id IS NULL);


-- 2. Fix Storage Folder Hijacking
-- Problem: Authenticated users could insert files into other users' folders if the file didn't exist.
-- Fix: Ensure the first part of the folder name matches their auth.uid().
DROP POLICY IF EXISTS "Authenticated Users can Upload" ON storage.objects;

CREATE POLICY "Authenticated Users can Upload"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK ( 
  bucket_id IN ('avatars', 'covers', 'offers', 'ads', 'chat-media', 'general')
  AND (storage.foldername(name))[1] = auth.uid()::text 
);

DROP POLICY IF EXISTS "Authenticated Users can Upload to new buckets" ON storage.objects;

CREATE POLICY "Authenticated Users can Upload to new buckets"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK ( 
  bucket_id IN ('services', 'stories', 'verifications', 'reports')
  AND (storage.foldername(name))[1] = auth.uid()::text 
);


-- 3. Fix Missing Unique Constraint on Saved Items
-- Problem: No DB-level constraint preventing duplicate saved items for a user.
-- Fix: Add UNIQUE constraint on profile_id, item_id, and item_type.
ALTER TABLE public.saved_items 
  DROP CONSTRAINT IF EXISTS saved_items_profile_item_unique;
  
ALTER TABLE public.saved_items 
  ADD CONSTRAINT saved_items_profile_item_unique UNIQUE (profile_id, item_id, item_type);
