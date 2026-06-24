import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-01-27.acacia' as any,
});

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const plans = [
    { name_en: 'Basic Plan', name_ar: 'الخطة الأساسية', price: 99, currency: 'aed', interval: 'month', features_en: ['Feature 1'], features_ar: ['ميزة 1'] },
    { name_en: 'Standard Plan', name_ar: 'الخطة القياسية', price: 149, currency: 'aed', interval: 'month', features_en: ['Feature 1', 'Feature 2'], features_ar: ['ميزة 1', 'ميزة 2'] },
    { name_en: 'Premium Plan', name_ar: 'الخطة المميزة', price: 249, currency: 'aed', interval: 'month', features_en: ['Feature 1', 'Feature 2', 'Feature 3'], features_ar: ['ميزة 1', 'ميزة 2', 'ميزة 3'] },
  ];

  for (let i = 0; i < plans.length; i++) {
    const plan = plans[i];
    console.log(`Creating Stripe Product for ${plan.name_en}...`);
    const product = await stripe.products.create({
      name: plan.name_en,
      description: plan.name_ar,
    });

    console.log(`Creating Stripe Price for ${plan.name_en}...`);
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: plan.price * 100, // in cents/fils
      currency: plan.currency,
      recurring: {
        interval: plan.interval as any,
      },
    });

    console.log(`Upserting to Supabase...`);
    // Try to update existing plan by name_en
    const { data: existing } = await supabase.from('subscription_plans').select('id').eq('name_en', plan.name_en).single();

    const planData = {
      name_en: plan.name_en,
      name_ar: plan.name_ar,
      price: plan.price,
      currency: plan.currency,
      interval: plan.interval,
      stripe_price_id: price.id,
      features_en: plan.features_en,
      features_ar: plan.features_ar,
      sort_order: i,
      is_active: true
    };

    if (existing) {
      await supabase.from('subscription_plans').update(planData).eq('id', existing.id);
    } else {
      await supabase.from('subscription_plans').insert(planData);
    }
  }
  
  // also update 'Enterprise Plan' to inactive if it exists to clean up
  await supabase.from('subscription_plans').update({ is_active: false }).eq('name_en', 'Enterprise Plan');

  console.log('Done!');
}

main().catch(console.error);
