import { supabaseAdmin } from './src/config/supabase';

async function testPlan() {
  const payload = {
    stripe_price_id: "price_1234567890_test_mcp",
    name_en: "Pro Plan",
    name_ar: "الخطة الاحترافية",
    description_en: "Full access to all features",
    description_ar: "وصول كامل لجميع الميزات",
    price: 9.99,
    interval: "monthly", // Note: The DB migration says interval in ('monthly', 'quarterly', 'yearly')
    currency: "usd",
    features_en: [
      "Unlimited offers",
      "Priority support"
    ],
    features_ar: [
      "عروض غير محدودة",
      "دعم أولوية"
    ],
    is_active: true
  };

  console.log('Testing plan insertion...');
  const { data, error } = await supabaseAdmin
    .from('subscription_plans')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Success! Plan inserted:', data);
    
    // Clean up
    await supabaseAdmin.from('subscription_plans').delete().eq('id', data.id);
    console.log('Test plan deleted successfully.');
  }
}

testPlan();
