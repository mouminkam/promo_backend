-- ==========================================
-- 008_create_reports_and_media.sql
-- ==========================================

-- 1. Create `reports` table
create table public.reports (
  id uuid primary key default uuid_generate_v4(),
  reporter_id uuid references public.profiles(id) on delete set null,
  reported_id uuid not null, -- Can refer to a profile, offer, ad, or message
  reported_type text check (reported_type in ('profile', 'offer', 'ad', 'message')) not null,
  reason text not null,
  details text,
  status text check (status in ('pending', 'reviewed', 'resolved', 'dismissed')) default 'pending',
  admin_note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  resolved_at timestamp with time zone
);

-- 2. Create `media` table (for tracking uploaded files)
create table public.media (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  file_name text not null,
  file_url text not null,
  file_type text not null,
  file_size int not null,
  related_to text check (related_to in ('profile', 'offer', 'ad', 'chat')),
  related_id uuid,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. RLS for Reports
alter table public.reports enable row level security;

create policy "Users can view their own reports."
  on public.reports for select
  using ( auth.uid() = reporter_id );

create policy "Users can submit reports."
  on public.reports for insert
  with check ( auth.uid() = reporter_id );

create policy "Admins can manage all reports."
  on public.reports for all
  using ( (select is_admin from public.profiles where id = auth.uid()) = true );

-- 4. RLS for Media
alter table public.media enable row level security;

-- Media metadata is generally public if it belongs to public content
create policy "Media is viewable by everyone."
  on public.media for select
  using ( true );

create policy "Users can insert their own media records."
  on public.media for insert
  with check ( auth.uid() = profile_id );

create policy "Users can delete their own media records."
  on public.media for delete
  using ( auth.uid() = profile_id );

create policy "Admins can manage all media."
  on public.media for all
  using ( (select is_admin from public.profiles where id = auth.uid()) = true );

-- Indexes
create index idx_reports_reporter on public.reports(reporter_id);
create index idx_reports_reported on public.reports(reported_id);
create index idx_reports_status on public.reports(status);
create index idx_media_profile on public.media(profile_id);
create index idx_media_related on public.media(related_id);
