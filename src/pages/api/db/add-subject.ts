// src/pages/api/db/add-subject.ts
import type { APIRoute } from 'astro';
import { sql } from '../../../lib/db';

export const POST: APIRoute = async ({ request }) => {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return new Response("JSON inválido", { status: 400 });
  }

  const name =
    typeof (payload as { name?: unknown }).name === 'string'
      ? (payload as { name?: string }).name?.trim()
      : '';
  const userId = (payload as { userId?: unknown }).userId;

  const hasValidUserId =
    typeof userId === 'string' ? userId.trim().length > 0 : typeof userId === 'number';

  if (!name || !hasValidUserId) {
    return new Response("Datos inválidos", { status: 400 });
  }

  try {
    const newSubject = await sql`
      INSERT INTO subjects (name, user_id)
      VALUES (${name}, ${userId})
      RETURNING *
    `;

    return new Response(JSON.stringify(newSubject[0]), { status: 201 });
  } catch (error) {
    console.error('Error guardando en PostgreSQL', error);
    return new Response("Error guardando en PostgreSQL", { status: 500 });
  }
};