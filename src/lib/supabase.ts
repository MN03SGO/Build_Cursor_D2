import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey?.trim()) {
  throw new Error('SUPABASE_URL y SUPABASE_ANON_KEY deben estar definidos en .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
