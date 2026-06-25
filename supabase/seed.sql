-- ==========================================
-- seed.sql
-- ==========================================
-- Initial data for the Promoo database

-- 1. Insert Categories
insert into public.categories (name_ar, name_en, slug, icon_url, sort_order)
values
  ('تكنولوجيا', 'Technology', 'technology', 'https://example.com/icons/tech.png', 1),
  ('تسويق', 'Marketing', 'marketing', 'https://example.com/icons/marketing.png', 2),
  ('تصميم', 'Design', 'design', 'https://example.com/icons/design.png', 3),
  ('برمجة', 'Programming', 'programming', 'https://example.com/icons/programming.png', 4),
  ('استشارات', 'Consulting', 'consulting', 'https://example.com/icons/consulting.png', 5),
  ('أخرى', 'Other', 'other', 'https://example.com/icons/other.png', 99)
on conflict (slug) do nothing;

-- 2. Insert Subscription Plans
-- =========================================================================
-- ⚠️ WARNING: STRIPE PRICE IDs ARE PLACEHOLDERS
-- These will cause a Stripe 'resource_missing' crash if used in testing.
-- You MUST update the 'stripe_price_id' column with real IDs from your
-- Stripe Dashboard before attempting to create Checkout sessions.
-- =========================================================================
insert into public.subscription_plans (name_ar, name_en, description_ar, description_en, price, currency, interval, stripe_price_id, sort_order, features_ar, features_en)
values
  (
    'الباقة الأساسية', 
    'Basic Plan', 
    'مثالية للمبتدئين', 
    'Perfect for beginners', 
    99.00, 
    'AED',
    'monthly', 
    'price_basic_monthly_placeholder', 
    1, 
    '["5 عروض شهرياً", "دعم فني أساسي", "ملف شخصي عادي"]'::jsonb,
    '["5 offers per month", "Basic support", "Standard profile"]'::jsonb
  ),
  (
    'الباقة القياسية', 
    'Standard Plan', 
    'للمحترفين', 
    'For professionals', 
    149.00, 
    'AED',
    'monthly', 
    'price_standard_monthly_placeholder', 
    2, 
    '["عروض غير محدودة", "دعم فني بأولوية", "تحليلات"]'::jsonb,
    '["Unlimited offers", "Priority support", "Analytics"]'::jsonb
  ),
  (
    'الباقة المميزة', 
    'Premium Plan', 
    'دعم كامل وميزات متقدمة', 
    'Full support and advanced features', 
    249.00, 
    'AED',
    'monthly', 
    'price_premium_monthly_placeholder', 
    3, 
    '["كل مميزات الباقة القياسية", "علامة التوثيق", "أولوية في الظهور"]'::jsonb,
    '["Everything in Standard", "Verified badge", "Priority placement"]'::jsonb
  )
on conflict (stripe_price_id) do nothing;

-- 3. Insert Seats
insert into public.seats (tier, price, position, status)
values
  ('gold', 499, 1, 'available'),
  ('silver', 299, 1, 'available'),
  ('bronze', 149, 1, 'available')
on conflict (id) do nothing;
