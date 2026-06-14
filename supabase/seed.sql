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
-- Replace stripe_price_id with actual IDs from the Stripe Dashboard later
insert into public.subscription_plans (name_ar, name_en, description_ar, description_en, price, interval, stripe_price_id, sort_order, features)
values
  (
    'الباقة الأساسية', 
    'Basic Plan', 
    'مثالية للمبتدئين', 
    'Perfect for beginners', 
    10.00, 
    'monthly', 
    'price_basic_monthly_placeholder', 
    1, 
    '["5 offers per month", "Basic support", "Standard profile"]'::jsonb
  ),
  (
    'الباقة المميزة', 
    'Premium Plan', 
    'للمحترفين والشركات', 
    'For professionals and companies', 
    29.00, 
    'monthly', 
    'price_premium_monthly_placeholder', 
    2, 
    '["Unlimited offers", "Priority support", "Verified badge", "Analytics"]'::jsonb
  ),
  (
    'باقة الشركات', 
    'Enterprise Plan', 
    'دعم كامل وميزات غير محدودة', 
    'Full support and unlimited features', 
    290.00, 
    'yearly', 
    'price_enterprise_yearly_placeholder', 
    3, 
    '["Everything in Premium", "Dedicated account manager", "Custom API access"]'::jsonb
  )
on conflict (stripe_price_id) do nothing;
