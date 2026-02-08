import type { APIRoute } from 'astro';
import { createHash } from 'crypto';
import { getSupabase } from '../../../lib/db';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return new Response('JSON inválido', { status: 400 });
  }

  const email =
    typeof (payload as { email?: unknown }).email === 'string'
      ? (payload as { email?: string }).email?.trim()
      : '';
  const password =
    typeof (payload as { password?: unknown }).password === 'string'
      ? (payload as { password?: string }).password
      : '';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !password || !emailRegex.test(email)) {
    return new Response('Datos inválidos', { status: 400 });
  }

  const passwordHash = createHash('sha256').update(password).digest('hex');

  try {
    const supabase = getSupabase();
    const { data: user, error } = await supabase
      .from('users')
      .select('id, nombre, email, plan')
      .eq('email', email)
      .eq('password_hash', passwordHash)
      .maybeSingle();

    if (error) {
      console.error('Error iniciando sesión', error);
      return new Response('Error iniciando sesión', { status: 500 });
    }

    if (!user) {
      return new Response('Credenciales inválidas', { status: 401 });
    }

    return new Response(
      JSON.stringify({
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        plan: user.plan ?? 'free'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error iniciando sesión', error);
    return new Response('Error iniciando sesión', { status: 500 });
  }
};
