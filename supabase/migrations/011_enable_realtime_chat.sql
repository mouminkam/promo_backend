-- ==========================================
-- 011_enable_realtime_chat.sql
-- ==========================================

-- Enable Supabase Realtime for chat modules
alter publication supabase_realtime add table public.chat_rooms;
alter publication supabase_realtime add table public.messages;
