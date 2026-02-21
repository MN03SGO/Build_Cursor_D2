import type { APIRoute } from 'astro';
import { getSupabase } from '../../../lib/db';

export const prerender = false;

/**
 * Después de que el usuario inicia sesión con GitHub (OAuth), el cliente
 * intercambia el código por sesión y nos envía el access_token. Aquí
 * obtenemos el usuario de Supabase Auth y lo sincronizamos con la tabla
 * `users` (id, nombre, email, plan) para que la app siga usando la misma
 * sesión en localStorage.
 */
export const POST: APIRoute = async ({ request }) => {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return new Response('JSON inválido', { status: 400 });
  }

  const accessToken =
    typeof (payload as { access_token?: unknown }).access_token === 'string'
      ? (payload as { access_token: string }).access_token
      : '';

  if (!accessToken) {
    return new Response('Falta access_token', { status: 400 });
  }

  try {
    const supabase = getSupabase();
    const {
      data: { user: authUser },
      error: authError
    } = await supabase.auth.getUser(accessToken);

    if (authError || !authUser?.email) {
      console.error('Error obteniendo usuario OAuth', authError);
      return new Response('Sesión inválida o expirada', { status: 401 });
    }

    const email = authUser.email.trim();
    const nombre =
      (authUser.user_metadata?.full_name || authUser.user_metadata?.name || email.split('@')[0] || 'Usuario').trim();

    const { data: existing } = await supabase.from('users').select('id, nombre, email, plan').eq('email', email).maybeSingle();

    if (existing) {
      return new Response(
        JSON.stringify({
          id: String(existing.id),
          nombre: existing.nombre ?? nombre,
          email: existing.email,
          plan: existing.plan ?? 'free'
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        nombre,
        email,
        password_hash: 'oauth:github',
        plan: 'free'
      })
      .select('id, nombre, email, plan')
      .single();

    if (insertError) {
      console.error('Error creando usuario OAuth', insertError);
      return new Response('Error creando usuario', { status: 500 });
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
  } catch (err) {
    console.error('Error sync-oauth', err);
    return new Response('Error en el servidor', { status: 500 });
  }
};
