import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Service Role Key in environment variables.');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Create realistic categories
  const categories = [
    { name_en: 'Influencer Marketing', name_ar: 'التسويق عبر المؤثرين', slug: 'influencer-marketing', type: 'service' },
    { name_en: 'Paid Advertising', name_ar: 'الإعلانات المدفوعة', slug: 'paid-advertising', type: 'service' },
    { name_en: 'Content Creation', name_ar: 'صناعة المحتوى', slug: 'content-creation', type: 'service' },
    { name_en: 'Design & Branding', name_ar: 'التصميم والعلامات التجارية', slug: 'design-branding', type: 'service' },
    { name_en: 'Business Growth', name_ar: 'نمو الأعمال', slug: 'business-growth', type: 'service' }
  ];

  for (const cat of categories) {
    await supabaseAdmin.from('categories').upsert(cat, { onConflict: 'slug' });
  }
  console.log('✅ Categories seeded.');

  // Fetch categories to use their IDs
  const { data: dbCategories } = await supabaseAdmin.from('categories').select('id, slug');
  if (!dbCategories || dbCategories.length === 0) return;

  // Variables removed

  // 2. Create Test Users
  console.log('👤 Creating Test Users...');
  const testUsers = [
    { email: 'influencer@test.com', password: 'TestPassword123', meta: { full_name: 'Test Influencer', account_type: 'influencer' } },
    { email: 'company@test.com', password: 'TestPassword123', meta: { full_name: 'Test Company', account_type: 'company' } },
    { email: 'provider@test.com', password: 'TestPassword123', meta: { full_name: 'Test Provider', account_type: 'service_provider' } },
    { email: 'user@test.com', password: 'TestPassword123', meta: { full_name: 'Test User', account_type: 'user' } },
  ];

  for (const tu of testUsers) {
    // Check if user exists
    const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
    const exists = usersData?.users.find(u => u.email === tu.email);
    
    if (!exists) {
      const { error } = await supabaseAdmin.auth.admin.createUser({
        email: tu.email,
        password: tu.password,
        email_confirm: true,
        user_metadata: tu.meta
      });
      if (error) {
        console.error(`Error creating ${tu.email}:`, error.message);
      } else {
        console.log(`✅ Created ${tu.email}`);
      }
    } else {
      console.log(`⚠️ User ${tu.email} already exists.`);
    }
  }

  console.log('✅ Seeding complete. You can now log in with the test accounts (Password: TestPassword123).');
}

main().catch(console.error);
