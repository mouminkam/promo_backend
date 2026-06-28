-- Migration 033: Fix two real bugs found during full API testing.
--
-- BUG 1: protect_sensitive_columns() (migration 029) referenced NEW.is_featured
--        and NEW.views_count for the `ads` table (which has NEITHER column) and
--        NEW.is_featured for `services` (which lacks it). Any authenticated UPDATE
--        to an ad or service threw: 'record "new" has no field "is_featured"'.
--        This broke ad/service editing entirely (Node uses the user-scoped client).
--        Fixed to reference only columns that actually exist on each table, and to
--        protect the real sensitive analytics columns on ads (impressions/clicks/spent).
--
-- BUG 2: The seats UPDATE policy used WITH CHECK (auth.uid() = influencer_id),
--        so the seat owner could NOT cancel/release their own seat (cancel sets
--        influencer_id = NULL, which failed the check). Allow releasing to NULL
--        while still preventing empty-seat hijacking (USING stays owner-only).

CREATE OR REPLACE FUNCTION public.protect_sensitive_columns()
RETURNS trigger AS $$
BEGIN
  IF (current_setting('role', true) = 'authenticated') THEN
    IF TG_TABLE_NAME = 'profiles' THEN
      NEW.is_admin := OLD.is_admin;
      NEW.is_verified := OLD.is_verified;
      NEW.is_featured := OLD.is_featured;
      NEW.followers_count := OLD.followers_count;
      NEW.stripe_customer_id := OLD.stripe_customer_id;
      NEW.account_type := OLD.account_type;
    ELSIF TG_TABLE_NAME = 'offers' THEN
      NEW.is_featured := OLD.is_featured;
      NEW.views_count := OLD.views_count;
    ELSIF TG_TABLE_NAME = 'services' THEN
      NEW.views_count := OLD.views_count;
    ELSIF TG_TABLE_NAME = 'ads' THEN
      NEW.impressions := OLD.impressions;
      NEW.clicks := OLD.clicks;
      NEW.spent := OLD.spent;
    ELSIF TG_TABLE_NAME = 'seats' THEN
      NEW.price := OLD.price;
      NEW.position := OLD.position;
      NEW.tier := OLD.tier;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Fix seat cancellation: owner can update their seat (USING), and may either keep
-- it assigned to themselves or release it to NULL (WITH CHECK). Empty seats remain
-- non-hijackable because USING requires auth.uid() = influencer_id to begin with.
DROP POLICY IF EXISTS "Influencers can update their own seat." ON public.seats;
CREATE POLICY "Influencers can update their own seat."
ON public.seats FOR UPDATE
USING (auth.uid() = influencer_id)
WITH CHECK (auth.uid() = influencer_id OR influencer_id IS NULL);

-- NOTE: The 4 missing storage buckets (services, stories, verifications, reports)
-- were also created during this fix via:
--   INSERT INTO storage.buckets (id, name, public) VALUES (...) ON CONFLICT DO NOTHING;
