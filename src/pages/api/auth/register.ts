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

  const nombre =
    typeof (payload as { nombre?: unknown }).nombre === 'string'
      ? (payload as { nombre?: string }).nombre?.trim()
      : '';
  const email =
    typeof (payload as { email?: unknown }).email === 'string'
      ? (payload as { email?: string }).email?.trim()
      : '';
  const password =
    typeof (payload as { password?: unknown }).password === 'string'
      ? (payload as { password?: string }).password
      : '';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!nombre || !email || !password || !emailRegex.test(email) || password.length < 6) {
    return new Response('Datos inválidos', { status: 400 });
  }

  const passwordHash = createHash('sha256').update(password).digest('hex');

  try {
    const supabase = getSupabase();
    const { data: existing } = await supabase.from('users').select('id').eq('email', email).maybeSingle();
    if (existing) {
      return new Response('El correo ya está registrado', { status: 409 });
    }

    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        nombre,
        email,
        password_hash: passwordHash,
        plan: 'free'
      })
      .select('id, nombre, email, plan')
      .single();

    if (error) {
      console.error('Error registrando usuario', error);
      const msg = error.message || 'Error desconocido de Supabase';
      return new Response(`Error registrando usuario: ${msg}`, { status: 500 });
    }

    return new Response(
      JSON.stringify({
        id: String(newUser?.id ?? ''),
        nombre: newUser?.nombre ?? nombre,
        email: newUser?.email ?? email,
        plan: newUser?.plan ?? 'free'
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error registrando usuario', error);
    const msg = error instanceof Error ? error.message : 'Error inesperado';
    return new Response(`Error registrando usuario: ${msg}`, { status: 500 });
  }
};
