import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function seedUsers() {
  console.log('🌱 Starting to seed 5 test users...');
  
  const usersToCreate = [
    { email: 'test1@example.com', name: 'Test User 1', password: 'password123' },
    { email: 'test2@example.com', name: 'Test User 2', password: 'password123' },
    { email: 'test3@example.com', name: 'Test User 3', password: 'password123' },
    { email: 'test4@example.com', name: 'Test User 4', password: 'password123' },
    { email: 'test5@example.com', name: 'Test User 5', password: 'password123' },
  ];

  for (const user of usersToCreate) {
    console.log(`Creating ${user.email}...`);
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true, // Bypass email confirmation!
      user_metadata: {
        full_name: user.name,
        account_type: 'user'
      }
    });

    if (error) {
      console.error(`❌ Failed to create ${user.email}:`, error.message);
    } else {
      console.log(`✅ Successfully created ${user.email} (ID: ${data.user.id})`);
    }
  }
  
  console.log('🎉 Done seeding users!');
}

seedUsers().catch(console.error);
