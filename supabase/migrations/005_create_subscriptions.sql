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
  interval text check (interval in ('monthly', 'quarterly', 'yearly')) not null,
  features jsonb default '[]'::jsonb,
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
