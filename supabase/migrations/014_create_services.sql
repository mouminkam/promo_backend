-- ==========================================
-- 014_create_services.sql
-- ==========================================

-- 1. Create the `services` table
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC NOT NULL,
    currency TEXT DEFAULT 'AED',
    delivery_days INTEGER NOT NULL CHECK (delivery_days > 0),
    media_urls TEXT[] DEFAULT '{}'::TEXT[],
    tags TEXT[] DEFAULT '{}'::TEXT[],
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'deleted')),
    views_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. RLS Policies
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active services are viewable by everyone."
  ON public.services FOR SELECT
  USING ( status = 'active' );

CREATE POLICY "Users can view their own services regardless of status."
  ON public.services FOR SELECT
  USING ( auth.uid() = profile_id );

CREATE POLICY "Users can insert their own services."
  ON public.services FOR INSERT
  WITH CHECK ( auth.uid() = profile_id );

CREATE POLICY "Users can update their own services."
  ON public.services FOR UPDATE
  USING ( auth.uid() = profile_id );

CREATE POLICY "Users can delete their own services."
  ON public.services FOR DELETE
  USING ( auth.uid() = profile_id );

CREATE POLICY "Admins can manage all services."
  ON public.services FOR ALL USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
  );

-- 3. Triggers
CREATE TRIGGER on_services_updated
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- 4. Indexes
CREATE INDEX idx_services_profile ON public.services(profile_id);
CREATE INDEX idx_services_category ON public.services(category_id);
CREATE INDEX idx_services_status ON public.services(status);
