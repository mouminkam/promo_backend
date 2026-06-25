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
