import { supabaseAdmin } from './src/config/supabase';
import { v4 as uuidv4 } from 'uuid';

async function insertMockPayment() {
  const profileId = '2fe4e7b0-93c1-46cc-a6ea-42e173722b81'; // User's ID
  
  const { data, error } = await supabaseAdmin.from('payments').insert({
    profile_id: profileId,
    stripe_payment_id: `pi_mock_${uuidv4().substring(0, 8)}`,
    amount: 150,
    type: 'featured',
    status: 'succeeded',
    metadata: {
      placement: 'home',
      duration_days: '7'
    }
  }).select().single();

  if (error) {
    console.error('Failed to insert mock payment:', error.message);
  } else {
    console.log('Mock payment inserted successfully!');
    console.log('PAYMENT_ID:', data.id);
  }
}

insertMockPayment();
