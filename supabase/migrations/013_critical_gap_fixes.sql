-- 1. Seats system
CREATE TABLE public.seats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tier TEXT NOT NULL CHECK (tier IN ('gold', 'silver', 'bronze')),
    price NUMERIC NOT NULL,
    influencer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'booked')),
    expires_at TIMESTAMP WITH TIME ZONE,
    position INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.seats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Seats are viewable by everyone." ON public.seats FOR SELECT USING (true);
CREATE POLICY "Admins can manage seats." ON public.seats FOR ALL USING (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);

-- 2. Stories feature
CREATE TABLE public.stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    views_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Stories are viewable by everyone." ON public.stories FOR SELECT USING (true);
CREATE POLICY "Users can insert their own stories." ON public.stories FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can delete their own stories." ON public.stories FOR DELETE USING (auth.uid() = profile_id);

-- 3. Saved Items (Bookmarks)
CREATE TABLE public.saved_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    item_id UUID NOT NULL,
    item_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own saved items." ON public.saved_items FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can insert their own saved items." ON public.saved_items FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can delete their own saved items." ON public.saved_items FOR DELETE USING (auth.uid() = profile_id);

-- 4. Ad creation form (Contact, Location, Pricing columns)
ALTER TABLE public.ads 
  ADD COLUMN phone TEXT,
  ADD COLUMN whatsapp TEXT,
  ADD COLUMN contact_email TEXT,
  ADD COLUMN instagram_link TEXT,
  ADD COLUMN city TEXT,
  ADD COLUMN area TEXT,
  ADD COLUMN full_address TEXT,
  ADD COLUMN location_map_url TEXT,
  ADD COLUMN price NUMERIC,
  ADD COLUMN currency TEXT,
  ADD COLUMN service_type TEXT,
  ADD COLUMN payment_method TEXT,
  ADD COLUMN tags TEXT[];

-- 5. Offers tags
ALTER TABLE public.offers 
  ADD COLUMN tags TEXT[];

-- 6. Media views_count
ALTER TABLE public.media 
  ADD COLUMN views_count INTEGER DEFAULT 0 NOT NULL;
