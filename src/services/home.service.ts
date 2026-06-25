// ============================================
// Promoo Backend — Home Service
// ============================================

import { supabaseAdmin } from '../config/supabase';
import { ApiError } from '../utils/apiError';
import { storyService } from './story.service';
import { adService } from './ad.service';
import { offerService } from './offer.service';
import { serviceService } from './service.service';

export class HomeService {
  async getHomeFeed() {
    try {
      // 1. Fetch active stories
      const stories = await storyService.getActiveStories().catch(() => []);

      // 2. Fetch top categories
      const { data: categories } = await supabaseAdmin
        .from('categories')
        .select('*')
        .limit(10);

      // 3. Fetch featured profiles (from featured_accounts table)
      const now = new Date().toISOString();
      const { data: featuredProfiles } = await supabaseAdmin
        .from('featured_accounts')
        .select('*, profile:profiles(id, full_name, username, avatar_url, account_type)')
        .eq('status', 'active')
        .gt('end_date', now)
        .order('position', { ascending: true })
        .limit(10);

      // 4. Fetch latest active offers (limit 10)
      const { data: offers } = await offerService.getOffers({ page: 1, limit: 10 }).catch(() => ({ data: [] }));

      // 5. Fetch Promoo Of The Day (first featured offer)
      const { data: promooOfTheDay } = await supabaseAdmin
        .from('offers')
        .select('*, profile:profiles(id, full_name, username, avatar_url, is_verified, account_type)')
        .eq('status', 'active')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // 6. Fetch top services
      const { data: services } = await serviceService.getServices({ page: 1, limit: 10 }).catch(() => ({ data: [] }));

      // 7. Fetch active ads (banners/popups)
      const ads = await adService.getActiveAds().catch(() => []);

      return {
        stories,
        categories: categories || [],
        featured_profiles: featuredProfiles || [],
        promoo_of_the_day: promooOfTheDay || null,
        latest_offers: offers || [],
        services: services || [],
        ads,
      };
    } catch (error: any) {
      throw ApiError.internal(error.message);
    }
  }
}

export const homeService = new HomeService();
