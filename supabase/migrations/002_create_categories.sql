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
