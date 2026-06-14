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
