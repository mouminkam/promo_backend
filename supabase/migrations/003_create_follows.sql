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
