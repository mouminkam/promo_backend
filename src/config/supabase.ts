// ============================================
// Promoo Backend — Supabase Client Configuration
// ============================================
// Two clients:
// 1. supabaseAdmin — uses SERVICE_ROLE key (bypasses RLS, server-side only)
// 2. createSupabaseClient — uses user JWT (respects RLS, per-request)

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from './env';

/**
 * Admin client — bypasses RLS.
 * Use ONLY in repositories for server-side operations.
 * NEVER expose this client to the frontend.
 */
export const supabaseAdmin: SupabaseClient = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * Auth client — used only to verify tokens.
 * This prevents auth operations from modifying supabaseAdmin's service_role headers.
 */
export const supabaseAuth: SupabaseClient = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * Creates a Supabase client scoped to a specific user's JWT.
 * This client respects RLS policies.
 * Use when you want operations to run in the context of a logged-in user.
 */
export function createSupabaseClient(accessToken: string): SupabaseClient {
  return createClient(
    env.SUPABASE_URL,
    env.SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
