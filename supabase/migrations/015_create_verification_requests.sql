-- ==========================================
-- 015_create_verification_requests.sql
-- ==========================================

-- 1. Create the `verification_requests` table
CREATE TABLE public.verification_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    document_url TEXT NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. RLS Policies
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own verification requests."
  ON public.verification_requests FOR SELECT
  USING ( auth.uid() = profile_id );

CREATE POLICY "Users can insert their own verification requests."
  ON public.verification_requests FOR INSERT
  WITH CHECK ( auth.uid() = profile_id );

CREATE POLICY "Admins can manage verification requests."
  ON public.verification_requests FOR ALL USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
  );

-- 3. Triggers
CREATE TRIGGER on_verification_requests_updated
  BEFORE UPDATE ON public.verification_requests
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- 4. Indexes
CREATE INDEX idx_verification_requests_profile ON public.verification_requests(profile_id);
CREATE INDEX idx_verification_requests_status ON public.verification_requests(status);
