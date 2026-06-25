-- ============================================
-- Promoo Backend — Migration 029
-- RLS Hardening and Seat Race Condition Fix
-- ============================================

-- 1. Revert Seat UPDATE policy to prevent empty seat hijacking
DROP POLICY IF EXISTS "Influencers can update their own seat." ON public.seats;

CREATE POLICY "Influencers can update their own seat."
ON public.seats FOR UPDATE
USING (auth.uid() = influencer_id)
WITH CHECK (auth.uid() = influencer_id);

-- 2. Create generic trigger to protect sensitive columns on UPDATE
-- This prevents users from modifying columns like is_admin via direct Supabase client access
CREATE OR REPLACE FUNCTION public.protect_sensitive_columns()
RETURNS trigger AS $$
BEGIN
  -- If the user is authenticated (but not using Service Role/Admin API)
  IF (current_setting('role', true) = 'authenticated') THEN
    -- Protect profiles
    IF TG_TABLE_NAME = 'profiles' THEN
      NEW.is_admin := OLD.is_admin;
      NEW.is_verified := OLD.is_verified;
      NEW.is_featured := OLD.is_featured;
      NEW.followers_count := OLD.followers_count;
      NEW.stripe_customer_id := OLD.stripe_customer_id;
      NEW.account_type := OLD.account_type;
    END IF;

    -- Protect offers
    IF TG_TABLE_NAME = 'offers' THEN
      NEW.is_featured := OLD.is_featured;
      NEW.views_count := OLD.views_count;
      -- Only allow users to change status to active or draft, NOT from rejected, unless it was already rejected (handled by Node API)
      -- Let's just protect is_featured and views_count here, status logic is complex and handled mostly by Node API.
    END IF;

    -- Protect services
    IF TG_TABLE_NAME = 'services' THEN
      NEW.is_featured := OLD.is_featured;
      NEW.views_count := OLD.views_count;
    END IF;

    -- Protect ads
    IF TG_TABLE_NAME = 'ads' THEN
      NEW.is_featured := OLD.is_featured;
      NEW.views_count := OLD.views_count;
    END IF;
    
    -- Protect seats
    IF TG_TABLE_NAME = 'seats' THEN
      -- Do not allow users to modify price, position, or tier directly
      NEW.price := OLD.price;
      NEW.position := OLD.position;
      NEW.tier := OLD.tier;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Apply trigger to profiles
DROP TRIGGER IF EXISTS protect_profiles_sensitive_cols ON public.profiles;
CREATE TRIGGER protect_profiles_sensitive_cols
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.protect_sensitive_columns();

-- Apply trigger to offers
DROP TRIGGER IF EXISTS protect_offers_sensitive_cols ON public.offers;
CREATE TRIGGER protect_offers_sensitive_cols
  BEFORE UPDATE ON public.offers
  FOR EACH ROW EXECUTE PROCEDURE public.protect_sensitive_columns();

-- Apply trigger to services
DROP TRIGGER IF EXISTS protect_services_sensitive_cols ON public.services;
CREATE TRIGGER protect_services_sensitive_cols
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE PROCEDURE public.protect_sensitive_columns();

-- Apply trigger to ads
DROP TRIGGER IF EXISTS protect_ads_sensitive_cols ON public.ads;
CREATE TRIGGER protect_ads_sensitive_cols
  BEFORE UPDATE ON public.ads
  FOR EACH ROW EXECUTE PROCEDURE public.protect_sensitive_columns();

-- Apply trigger to seats
DROP TRIGGER IF EXISTS protect_seats_sensitive_cols ON public.seats;
CREATE TRIGGER protect_seats_sensitive_cols
  BEFORE UPDATE ON public.seats
  FOR EACH ROW EXECUTE PROCEDURE public.protect_sensitive_columns();
