// ============================================
// Promoo Backend — Stripe Client Configuration
// ============================================

import Stripe from 'stripe';
import { env } from './env';

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  typescript: true,
});
