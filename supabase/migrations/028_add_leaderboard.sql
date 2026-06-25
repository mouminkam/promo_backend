-- ============================================
-- 028_add_leaderboard.sql
-- Cup / Leaderboard feature
-- ============================================
-- Adds a cached followers_count on profiles (Plan A: stored attribute that
-- represents real-world reach) and keeps it in sync with the in-app follows
-- table via a trigger. The Cup page ranks active accounts by this column.

-- 1. Cached followers count on profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS followers_count INTEGER NOT NULL DEFAULT 0;

-- 2. Index for fast leaderboard ordering (active accounts only)
CREATE INDEX IF NOT EXISTS idx_profiles_followers_count
  ON public.profiles (followers_count DESC)
  WHERE is_active = true;

-- 3. Trigger fn: keep followers_count in sync with the follows table.
--    search_path is pinned to '' (hardening), so every object is fully qualified.
CREATE OR REPLACE FUNCTION public.sync_followers_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE public.profiles
      SET followers_count = followers_count + 1
      WHERE id = NEW.following_id;
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE public.profiles
      SET followers_count = GREATEST(followers_count - 1, 0)
      WHERE id = OLD.following_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- 4. Attach trigger
DROP TRIGGER IF EXISTS trg_sync_followers_count ON public.follows;
CREATE TRIGGER trg_sync_followers_count
  AFTER INSERT OR DELETE ON public.follows
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_followers_count();

-- 5. Backfill from existing follows so the count is correct from day one
UPDATE public.profiles p
  SET followers_count = sub.cnt
  FROM (
    SELECT following_id, COUNT(*)::int AS cnt
    FROM public.follows
    GROUP BY following_id
  ) sub
  WHERE p.id = sub.following_id;
