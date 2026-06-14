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
