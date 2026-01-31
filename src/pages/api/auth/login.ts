import type { APIRoute } from 'astro';
import { createHash } from 'crypto';
import { getDb } from '../../../lib/db';

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

  if (!email || !password) {
    return new Response('Datos inválidos', { status: 400 });
  }

  const passwordHash = createHash('sha256').update(password).digest('hex');

  try {
    const db = await getDb();
    const user = await db.collection('users').findOne({
      email,
      password_hash: passwordHash
    });

    if (!user) {
      return new Response('Credenciales inválidas', { status: 401 });
    }

    return new Response(
      JSON.stringify({
        id: user._id.toString(),
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
