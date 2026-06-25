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
