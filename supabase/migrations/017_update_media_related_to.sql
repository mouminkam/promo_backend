-- ==========================================
-- 017_update_media_related_to.sql
-- ==========================================

-- Drop the existing constraint on related_to
ALTER TABLE public.media DROP CONSTRAINT IF EXISTS media_related_to_check;

-- Add the updated constraint including new modules
ALTER TABLE public.media ADD CONSTRAINT media_related_to_check 
  CHECK (related_to IN ('profile', 'offer', 'ad', 'chat', 'service', 'story', 'report', 'verification'));
