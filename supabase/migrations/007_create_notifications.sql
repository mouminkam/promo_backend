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
