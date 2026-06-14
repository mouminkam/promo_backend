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
  with check ( true ); -- Need a tighter policy in practice or handle via Edge Function/Service Role

-- Users can see participants of their rooms
create policy "Users can view participants of their rooms."
  on public.chat_participants for select
  using ( exists (
    select 1 from public.chat_participants cp
    where cp.room_id = public.chat_participants.room_id and cp.profile_id = auth.uid()
  ));

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
