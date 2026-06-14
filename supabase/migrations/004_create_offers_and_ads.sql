-- ==========================================
-- 004_create_offers_and_ads.sql
-- ==========================================

-- 1. Create the `offers` table
create table public.offers (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  category_id uuid references public.categories(id) on delete restrict not null,
  title text not null,
  description text not null,
  original_price decimal(10, 2),
  offer_price decimal(10, 2) not null,
  discount_percentage int check (discount_percentage >= 0 and discount_percentage <= 100),
  media_urls text[] default '{}'::text[],
  start_date timestamp with time zone not null,
  end_date timestamp with time zone,
  status text check (status in ('draft', 'active', 'expired', 'rejected')) default 'active',
  is_featured boolean default false,
  views_count int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create the `ads` table
create table public.ads (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  media_url text not null,
  ad_type text check (ad_type in ('banner', 'popup', 'featured')) not null,
  target_url text,
  budget decimal(10, 2) not null,
  spent decimal(10, 2) default 0,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone,
  status text check (status in ('pending', 'active', 'paused', 'completed', 'rejected')) default 'pending',
  impressions int default 0,
  clicks int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. RLS for Offers
alter table public.offers enable row level security;

create policy "Active offers are viewable by everyone."
  on public.offers for select
  using ( status = 'active' );

create policy "Users can view their own offers regardless of status."
  on public.offers for select
  using ( auth.uid() = profile_id );

create policy "Users can insert their own offers."
  on public.offers for insert
  with check ( auth.uid() = profile_id );

create policy "Users can update their own offers."
  on public.offers for update
  using ( auth.uid() = profile_id );

create policy "Users can delete their own offers."
  on public.offers for delete
  using ( auth.uid() = profile_id );

-- 4. RLS for Ads
alter table public.ads enable row level security;

create policy "Active ads are viewable by everyone."
  on public.ads for select
  using ( status = 'active' );

create policy "Users can view their own ads."
  on public.ads for select
  using ( auth.uid() = profile_id );

create policy "Users can insert their own ads."
  on public.ads for insert
  with check ( auth.uid() = profile_id );

create policy "Users can update their own ads."
  on public.ads for update
  using ( auth.uid() = profile_id );

create policy "Admins can manage all ads and offers."
  on public.offers for all using ( (select is_admin from public.profiles where id = auth.uid()) = true );
create policy "Admins can manage all ads."
  on public.ads for all using ( (select is_admin from public.profiles where id = auth.uid()) = true );

-- 5. Triggers
create trigger on_offers_updated
  before update on public.offers
  for each row execute procedure public.handle_updated_at();

create trigger on_ads_updated
  before update on public.ads
  for each row execute procedure public.handle_updated_at();

-- Indexes
create index idx_offers_profile on public.offers(profile_id);
create index idx_offers_category on public.offers(category_id);
create index idx_offers_status on public.offers(status);
create index idx_ads_profile on public.ads(profile_id);
create index idx_ads_status on public.ads(status);
