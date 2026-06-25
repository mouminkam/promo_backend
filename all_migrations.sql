-- ==========================================
-- 001_create_profiles.sql
-- ==========================================
-- Creates the profiles table and sets up the trigger to 
-- auto-create a profile when a new user signs up in Supabase Auth.

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- 1. Create the `profiles` table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  phone text,
  full_name text,
  username text unique,
  avatar_url text,
  cover_url text,
  bio text,
  account_type text check (account_type in ('company', 'influencer', 'service_provider', 'user')) default 'user',
  is_verified boolean default false,
  is_featured boolean default false,
  category_id uuid, -- Foreign key will be added after categories table is created
  location text,
  website text,
  social_links jsonb default '{}'::jsonb,
  company_details jsonb default '{}'::jsonb,
  influencer_details jsonb default '{}'::jsonb,
  service_provider_details jsonb default '{}'::jsonb,
  stripe_customer_id text,
  is_admin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update their own profile."
  on public.profiles for update
  using ( auth.uid() = id );

-- Admins can do anything
create policy "Admins can manage all profiles."
  on public.profiles for all
  using ( (select is_admin from public.profiles where id = auth.uid()) = true );

-- 3. Set up Auto-Update Trigger for `updated_at`
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_profiles_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- 4. Set up Auto-Create Profile Trigger for new Auth Users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, phone, full_name, account_type)
  values (
    new.id,
    new.email,
    new.phone,
    coalesce(new.raw_user_meta_data->>'full_name', 'New User'),
    coalesce(new.raw_user_meta_data->>'account_type', 'user')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Indexes for fast queries
create index idx_profiles_username on public.profiles(username);
create index idx_profiles_account_type on public.profiles(account_type);
create index idx_profiles_is_featured on public.profiles(is_featured);
-- ==========================================
-- 002_create_categories.sql
-- ==========================================

-- 1. Create the `categories` table
create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  name_ar text not null,
  name_en text not null,
  slug text unique not null,
  icon_url text,
  parent_id uuid references public.categories(id) on delete set null,
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add foreign key back to profiles now that categories exists
alter table public.profiles
  add constraint fk_profiles_category
  foreign key (category_id)
  references public.categories(id)
  on delete set null;

-- 2. Set up RLS
alter table public.categories enable row level security;

create policy "Categories are viewable by everyone."
  on public.categories for select
  using ( is_active = true );

create policy "Admins can manage all categories."
  on public.categories for all
  using ( (select is_admin from public.profiles where id = auth.uid()) = true );

-- 3. Trigger for updated_at
create trigger on_categories_updated
  before update on public.categories
  for each row execute procedure public.handle_updated_at();

-- Indexes
create index idx_categories_parent_id on public.categories(parent_id);
create index idx_categories_slug on public.categories(slug);
-- ==========================================
-- 003_create_follows.sql
-- ==========================================

-- 1. Create the `follows` table
create table public.follows (
  id uuid primary key default uuid_generate_v4(),
  follower_id uuid references public.profiles(id) on delete cascade not null,
  following_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(follower_id, following_id) -- Prevent duplicate follows
);

-- Prevent users from following themselves
alter table public.follows
  add constraint check_not_self_follow check (follower_id != following_id);

-- 2. Set up RLS
alter table public.follows enable row level security;

create policy "Follows are viewable by everyone."
  on public.follows for select
  using ( true );

create policy "Users can follow others."
  on public.follows for insert
  with check ( auth.uid() = follower_id );

create policy "Users can unfollow."
  on public.follows for delete
  using ( auth.uid() = follower_id );

-- 3. Follow Counters (Optional but recommended for scale)
-- We'll just rely on `count(*)` queries for now, but adding indexes is critical.

create index idx_follows_follower on public.follows(follower_id);
create index idx_follows_following on public.follows(following_id);
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
-- ==========================================
-- 005_create_subscriptions.sql
-- ==========================================

-- 1. Create the `subscription_plans` table
create table public.subscription_plans (
  id uuid primary key default uuid_generate_v4(),
  name_ar text not null,
  name_en text not null,
  description_ar text,
  description_en text,
  price decimal(10, 2) not null,
  currency text default 'usd' not null,
  interval text check (interval in ('monthly', 'quarterly', 'yearly')) not null,
  features_ar jsonb default '[]'::jsonb,
  features_en jsonb default '[]'::jsonb,
  stripe_price_id text unique not null,
  is_active boolean default true,
  sort_order int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create the `subscriptions` table
create table public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  plan_id uuid references public.subscription_plans(id) on delete restrict not null,
  stripe_subscription_id text unique not null,
  status text check (status in ('active', 'past_due', 'canceled', 'trialing')) not null,
  current_period_start timestamp with time zone not null,
  current_period_end timestamp with time zone not null,
  canceled_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure a user only has one active subscription at a time
create unique index idx_unique_active_subscription 
  on public.subscriptions (profile_id) 
  where status in ('active', 'trialing', 'past_due');

-- 3. Set up RLS
alter table public.subscription_plans enable row level security;
alter table public.subscriptions enable row level security;

-- Plans are public
create policy "Plans are viewable by everyone."
  on public.subscription_plans for select
  using ( is_active = true );

-- Users can see their own subscriptions
create policy "Users can view their own subscriptions."
  on public.subscriptions for select
  using ( auth.uid() = profile_id );

-- Admins
create policy "Admins can manage all plans."
  on public.subscription_plans for all
  using ( (select is_admin from public.profiles where id = auth.uid()) = true );

create policy "Admins can manage all subscriptions."
  on public.subscriptions for all
  using ( (select is_admin from public.profiles where id = auth.uid()) = true );

-- Note: Subscriptions are usually inserted/updated via Stripe Webhooks (using Service Role)
-- So we don't need user insert/update policies for the subscriptions table.

-- 4. Triggers
create trigger on_plans_updated
  before update on public.subscription_plans
  for each row execute procedure public.handle_updated_at();

create trigger on_subscriptions_updated
  before update on public.subscriptions
  for each row execute procedure public.handle_updated_at();

-- Indexes
create index idx_subscriptions_profile on public.subscriptions(profile_id);
create index idx_subscriptions_stripe_id on public.subscriptions(stripe_subscription_id);
-- ==========================================
-- 006_create_chat.sql
-- ==========================================

-- 1. Create `chat_rooms`
create table public.chat_rooms (
  id uuid primary key default uuid_generate_v4(),
  type text check (type in ('direct', 'group')) default 'direct',
  name text, -- useful for group chats if needed later
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_message_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create `chat_participants`
create table public.chat_participants (
  id uuid primary key default uuid_generate_v4(),
  room_id uuid references public.chat_rooms(id) on delete cascade not null,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_read_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(room_id, profile_id)
);

-- 3. Create `messages`
create table public.messages (
  id uuid primary key default uuid_generate_v4(),
  room_id uuid references public.chat_rooms(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  content text,
  type text check (type in ('text', 'image', 'video', 'file')) default 'text',
  media_url text,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Require either content or media_url
alter table public.messages
  add constraint check_message_content check (content is not null or media_url is not null);

-- 4. RLS

alter table public.chat_rooms enable row level security;
alter table public.chat_participants enable row level security;
alter table public.messages enable row level security;

-- Users can access rooms they are part of
create policy "Users can view their chat rooms."
  on public.chat_rooms for select
  using ( exists (
    select 1 from public.chat_participants 
    where room_id = public.chat_rooms.id and profile_id = auth.uid()
  ));

create policy "Users can create chat rooms."
  on public.chat_rooms for insert
  with check ( auth.uid() is not null );

CREATE OR REPLACE FUNCTION public.is_room_participant(_room_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.chat_participants
    WHERE room_id = _room_id AND profile_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

create policy "Users can view participants of their rooms."
  on public.chat_participants for select
  using (
    profile_id = auth.uid() OR public.is_room_participant(room_id)
  );

create policy "Users can join rooms."
  on public.chat_participants for insert
  with check ( auth.uid() = profile_id );

create policy "Users can update their participant status."
  on public.chat_participants for update
  using ( auth.uid() = profile_id );

-- Users can read messages in their rooms
create policy "Users can view messages in their rooms."
  on public.messages for select
  using ( exists (
    select 1 from public.chat_participants 
    where room_id = public.messages.room_id and profile_id = auth.uid()
  ));

-- Users can send messages to their rooms
create policy "Users can insert messages to their rooms."
  on public.messages for insert
  with check ( auth.uid() = sender_id and exists (
    select 1 from public.chat_participants 
    where room_id = public.messages.room_id and profile_id = auth.uid()
  ));

-- 5. Trigger to update `last_message_at`
create or replace function public.update_room_last_message()
returns trigger as $$
begin
  update public.chat_rooms
  set last_message_at = new.created_at
  where id = new.room_id;
  return new;
end;
$$ language plpgsql;

create trigger on_message_inserted
  after insert on public.messages
  for each row execute procedure public.update_room_last_message();

-- Indexes
create index idx_participants_profile on public.chat_participants(profile_id);
create index idx_participants_room on public.chat_participants(room_id);
create index idx_messages_room on public.messages(room_id);
-- ==========================================
-- 007_create_notifications.sql
-- ==========================================

-- 1. Create `notifications` table
create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  body text not null,
  type text check (type in ('follow', 'message', 'offer', 'system', 'payment')) not null,
  data jsonb default '{}'::jsonb,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create FCM Tokens table (to store device tokens for push notifications)
create table public.fcm_tokens (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  token text unique not null,
  device_type text, -- 'ios', 'android', 'web'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. RLS Policies
alter table public.notifications enable row level security;
alter table public.fcm_tokens enable row level security;

-- Users can see their own notifications
create policy "Users can view their own notifications."
  on public.notifications for select
  using ( auth.uid() = profile_id );

-- Users can update their own notifications (e.g., mark as read)
create policy "Users can update their own notifications."
  on public.notifications for update
  using ( auth.uid() = profile_id );

create policy "Users can delete their own notifications."
  on public.notifications for delete
  using ( auth.uid() = profile_id );

-- Users can manage their own FCM tokens
create policy "Users can manage their FCM tokens."
  on public.fcm_tokens for all
  using ( auth.uid() = profile_id );

-- 4. Triggers
create trigger on_fcm_tokens_updated
  before update on public.fcm_tokens
  for each row execute procedure public.handle_updated_at();

-- Indexes
create index idx_notifications_profile on public.notifications(profile_id);
create index idx_notifications_is_read on public.notifications(is_read);
create index idx_fcm_tokens_profile on public.fcm_tokens(profile_id);
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
  related_to text constraint media_related_to_check check (related_to in ('profile', 'offer', 'ad', 'chat')),
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
-- ==========================================
-- 009_create_payments_and_featured.sql
-- ==========================================

-- 1. Create `payments` table
create table public.payments (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  stripe_payment_id text unique not null,
  amount decimal(10, 2) not null,
  currency text default 'usd',
  type text check (type in ('subscription', 'ad', 'featured')) not null,
  status text check (status in ('succeeded', 'pending', 'failed', 'refunded')) not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create `featured_accounts` table
create table public.featured_accounts (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  placement text check (placement in ('home', 'search', 'category')) not null,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  amount_paid decimal(10, 2) not null,
  is_active boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. RLS Policies
alter table public.payments enable row level security;
alter table public.featured_accounts enable row level security;

-- Users can see their own payments
create policy "Users can view their own payments."
  on public.payments for select
  using ( auth.uid() = profile_id );

-- Admins can see all payments
create policy "Admins can manage all payments."
  on public.payments for all
  using ( (select is_admin from public.profiles where id = auth.uid()) = true );

-- Featured accounts
create policy "Active featured accounts are viewable by everyone."
  on public.featured_accounts for select
  using ( is_active = true and now() between start_date and end_date );

create policy "Users can view their own featured account records."
  on public.featured_accounts for select
  using ( auth.uid() = profile_id );

create policy "Admins can manage all featured accounts."
  on public.featured_accounts for all
  using ( (select is_admin from public.profiles where id = auth.uid()) = true );

-- Trigger for sync: Auto-update is_featured on profiles when featured_account becomes active/inactive
create or replace function public.sync_profile_featured_status()
returns trigger as $$
begin
  -- If inserted or updated to active
  if (TG_OP = 'INSERT' or TG_OP = 'UPDATE') and new.is_active = true and now() between new.start_date and new.end_date then
    update public.profiles set is_featured = true where id = new.profile_id;
  end if;
  
  -- If updated to inactive or expired
  if (TG_OP = 'UPDATE') and (new.is_active = false or now() > new.end_date) then
    update public.profiles set is_featured = false where id = new.profile_id;
  end if;

  return new;
end;
$$ language plpgsql;

create trigger on_featured_account_change
  after insert or update on public.featured_accounts
  for each row execute procedure public.sync_profile_featured_status();

-- Indexes
create index idx_payments_profile on public.payments(profile_id);
create index idx_payments_stripe_id on public.payments(stripe_payment_id);
create index idx_featured_profile on public.featured_accounts(profile_id);
create index idx_featured_dates on public.featured_accounts(start_date, end_date);
-- ==========================================
-- 010_add_is_active_to_profiles.sql
-- ==========================================

-- Add the missing is_active column for the User Ban feature
alter table public.profiles add column if not exists is_active boolean default true;
-- ==========================================
-- 011_enable_realtime_chat.sql
-- ==========================================

-- Enable Supabase Realtime for chat modules
alter publication supabase_realtime add table public.chat_rooms;
alter publication supabase_realtime add table public.messages;
-- ==========================================
-- 012_add_currency_to_plans.sql
-- ==========================================

-- NO-OP: The 'currency' column was already added in 005_create_subscriptions.sql.
-- This migration has been intentionally left blank to prevent DuplicateColumn errors.
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
-- ==========================================
-- 017_update_media_related_to.sql
-- ==========================================

-- Drop the existing constraint on related_to
ALTER TABLE public.media DROP CONSTRAINT IF EXISTS media_related_to_check;

-- Add the updated constraint including new modules
ALTER TABLE public.media ADD CONSTRAINT media_related_to_check 
  CHECK (related_to IN ('profile', 'offer', 'ad', 'chat', 'service', 'story', 'report', 'verification'));
-- ==========================================
-- 018_fix_database_constraints.sql
-- ==========================================

-- 1. Fix subscriptions status constraint
ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_status_check;
ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_status_check 
  CHECK (status IN ('active', 'past_due', 'canceled', 'trialing', 'incomplete', 'incomplete_expired', 'unpaid', 'paused'));

-- 2. Fix reports reported_type constraint
ALTER TABLE public.reports DROP CONSTRAINT IF EXISTS reports_reported_type_check;
ALTER TABLE public.reports ADD CONSTRAINT reports_reported_type_check 
  CHECK (reported_type IN ('profile', 'offer', 'ad', 'message', 'service', 'story', 'seat'));
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
-- ============================================
-- 020: Fix Database Warnings
-- ============================================

-- 1. Create missing RPC function for incrementing service views
CREATE OR REPLACE FUNCTION public.increment_service_views(service_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.services
  SET views_count = COALESCE(views_count, 0) + 1
  WHERE id = service_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Add missing DELETE policy for ads
CREATE POLICY "Users can delete their own ads."
ON public.ads FOR DELETE
USING (auth.uid() = profile_id);

-- 3. Add missing Admin ALL policies
CREATE POLICY "Admins can manage chat_rooms" ON public.chat_rooms FOR ALL USING (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);

CREATE POLICY "Admins can manage chat_participants" ON public.chat_participants FOR ALL USING (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);

CREATE POLICY "Admins can manage messages" ON public.messages FOR ALL USING (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);

CREATE POLICY "Admins can manage notifications" ON public.notifications FOR ALL USING (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);

CREATE POLICY "Admins can manage fcm_tokens" ON public.fcm_tokens FOR ALL USING (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);

CREATE POLICY "Admins can manage saved_items" ON public.saved_items FOR ALL USING (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);

CREATE POLICY "Admins can manage stories" ON public.stories FOR ALL USING (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);
-- ============================================
-- 021_reassert_triggers.sql
-- ============================================
-- Re-asserts core system functions to decouple them structurally
-- from 001_create_profiles.sql, preventing breakages on partial restores.

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, phone, full_name, account_type)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.phone,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'account_type', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- ============================================
-- Migration: Add missing index on profiles table
-- ============================================

CREATE INDEX IF NOT EXISTS idx_profiles_category_id ON public.profiles(category_id);
-- ============================================
-- Promoo Backend â€” Migration 022
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
-- 1. Critical Fix: Seat Booking Flow
DROP POLICY IF EXISTS "Influencers can update their own seat." ON public.seats;

CREATE POLICY "Influencers can update their own seat."
ON public.seats FOR UPDATE
USING (influencer_id IS NULL OR auth.uid() = influencer_id)
WITH CHECK (influencer_id IS NULL OR auth.uid() = influencer_id);

-- 2. Critical Fix: Storage UPDATE Policy Blocks New Features
DROP POLICY IF EXISTS "Users can Update their own files in new buckets" ON storage.objects;

CREATE POLICY "Users can Update their own files in new buckets"
ON storage.objects FOR UPDATE TO authenticated
USING ( auth.uid() = owner )
WITH CHECK ( bucket_id IN ('services', 'stories', 'verifications', 'reports') );

-- 3. Warning Fix: Missing notifications.type Extensions
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;

ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check 
  CHECK (type IN ('follow', 'message', 'offer', 'system', 'payment', 'seat_booking', 'service_update', 'verification_update', 'story_update'));

-- 4. Warning Fix: Orphaned chat_rooms on Account Deletion
CREATE OR REPLACE FUNCTION public.cleanup_empty_chat_rooms()
RETURNS trigger AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.chat_participants WHERE room_id = OLD.room_id) THEN
    DELETE FROM public.chat_rooms WHERE id = OLD.room_id;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_participant_removed ON public.chat_participants;

CREATE TRIGGER on_participant_removed
  AFTER DELETE ON public.chat_participants
  FOR EACH ROW EXECUTE PROCEDURE public.cleanup_empty_chat_rooms();

-- 5. Warning Fix: Currency Default Unification
ALTER TABLE public.services ALTER COLUMN currency SET DEFAULT 'usd';

-- 6. Warning Fix: Polymorphic Foreign Key Risks (Cascading Deletes)
CREATE OR REPLACE FUNCTION public.cascade_polymorphic_deletes()
RETURNS trigger AS $$
BEGIN
  DELETE FROM public.media WHERE related_id = OLD.id;
  DELETE FROM public.reports WHERE reported_id = OLD.id;
  DELETE FROM public.saved_items WHERE item_id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS cascade_offer_delete ON public.offers;
CREATE TRIGGER cascade_offer_delete AFTER DELETE ON public.offers FOR EACH ROW EXECUTE PROCEDURE public.cascade_polymorphic_deletes();

DROP TRIGGER IF EXISTS cascade_ad_delete ON public.ads;
CREATE TRIGGER cascade_ad_delete AFTER DELETE ON public.ads FOR EACH ROW EXECUTE PROCEDURE public.cascade_polymorphic_deletes();

DROP TRIGGER IF EXISTS cascade_service_delete ON public.services;
CREATE TRIGGER cascade_service_delete AFTER DELETE ON public.services FOR EACH ROW EXECUTE PROCEDURE public.cascade_polymorphic_deletes();

DROP TRIGGER IF EXISTS cascade_story_delete ON public.stories;
CREATE TRIGGER cascade_story_delete AFTER DELETE ON public.stories FOR EACH ROW EXECUTE PROCEDURE public.cascade_polymorphic_deletes();

DROP TRIGGER IF EXISTS cascade_seat_delete ON public.seats;
CREATE TRIGGER cascade_seat_delete AFTER DELETE ON public.seats FOR EACH ROW EXECUTE PROCEDURE public.cascade_polymorphic_deletes();

-- 7. Security Gaps: Missing RLS Policies
DROP POLICY IF EXISTS "Admins can manage follows." ON public.follows;
CREATE POLICY "Admins can manage follows." ON public.follows FOR ALL USING (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);

DROP POLICY IF EXISTS "Users can delete their own profile." ON public.profiles;
CREATE POLICY "Users can delete their own profile." ON public.profiles FOR DELETE USING ( auth.uid() = id );
