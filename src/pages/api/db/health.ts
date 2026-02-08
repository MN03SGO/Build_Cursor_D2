import type { APIRoute } from 'astro';
import { getSupabase } from '../../../lib/db';

export const GET: APIRoute = async () => {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from('users').select('id').limit(1).maybeSingle();
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('DB health check failed', error);
    return new Response(JSON.stringify({ ok: false }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
