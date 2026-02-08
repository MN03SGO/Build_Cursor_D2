import { supabase } from './supabase';

/** Cliente de Supabase para usar en las APIs (reemplazo de la antigua conexión MongoDB). */
export function getSupabase() {
  return supabase;
}
