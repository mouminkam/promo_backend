-- Storage Policies for Promoo App

-- 1. Create Buckets if they don't exist
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('avatars', 'avatars', true),
  ('covers', 'covers', true),
  ('offers', 'offers', true),
  ('ads', 'ads', true),
  ('chat-media', 'chat-media', true),
  ('general', 'general', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Enable RLS on storage.objects (just in case it was disabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 2. Allow Public Read Access (Select) for all specified buckets
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING ( bucket_id IN ('avatars', 'covers', 'offers', 'ads', 'chat-media', 'general') );

-- 3. Allow Authenticated Users to Upload (Insert)
-- Note: 'owner' is automatically set to auth.uid() by Supabase Storage
CREATE POLICY "Authenticated Users can Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id IN ('avatars', 'covers', 'offers', 'ads', 'chat-media', 'general') );

-- 4. Allow Authenticated Users to Update their own files
CREATE POLICY "Users can Update their own files"
ON storage.objects FOR UPDATE
TO authenticated
USING ( auth.uid() = owner )
WITH CHECK ( bucket_id IN ('avatars', 'covers', 'offers', 'ads', 'chat-media', 'general') );

-- 5. Allow Authenticated Users to Delete their own files
CREATE POLICY "Users can Delete their own files"
ON storage.objects FOR DELETE
TO authenticated
USING ( auth.uid() = owner );
