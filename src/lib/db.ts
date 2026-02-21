import { supabase } from './supabase';

/** Cliente de Supabase para usar en las APIs. */
export function getSupabase() {
  return supabase;
}
