import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// If env vars aren't set yet, `supabase` is null and every write below falls
// back to local storage (see store/useLeadsStore.js) so no lead is ever lost
// while you're still setting up your project.
export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;

/**
 * Insert a lead/booking row into Supabase.
 *
 * Expected table (create this in the Supabase SQL editor once your project
 * is ready):
 *
 *   create table leads (
 *     id uuid primary key default gen_random_uuid(),
 *     created_at timestamptz default now(),
 *     status text default 'New Lead',
 *     is_future_lead boolean default false,
 *     contact jsonb,      -- { name, phone, email, address }
 *     occasion text,
 *     wedding_date date,
 *     days jsonb,         -- array of per-day event details
 *     addons jsonb,       -- selected add-ons + extras
 *     price jsonb         -- { lineItems, grandTotal, advance, remaining, recommendation }
 *   );
 *
 *   alter table leads enable row level security;
 *   -- add policies for your admin users once auth is set up.
 */
export async function insertLeadToSupabase(lead) {
  if (!supabase) {
    console.warn(
      '[Supabase not configured] Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env to sync leads to your database.'
    );
    return { data: null, error: new Error('Supabase not configured') };
  }

  return supabase.from('leads').insert(lead).select().single();
}
