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

  if (!nombre || !email || !password) {
    return new Response('Datos inválidos', { status: 400 });
  }

  const passwordHash = createHash('sha256').update(password).digest('hex');

  try {
    const db = await getDb();
    const existing = await db.collection('users').findOne({ email });
    if (existing) {
      return new Response('El correo ya está registrado', { status: 409 });
    }

    const result = await db.collection('users').insertOne({
      nombre,
      email,
      password_hash: passwordHash,
      plan: 'free',
      created_at: new Date()
    });

    return new Response(
      JSON.stringify({
        id: result.insertedId.toString(),
        nombre,
        email,
        plan: 'free'
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error registrando usuario', error);
    return new Response('Error registrando usuario', { status: 500 });
  }
};
