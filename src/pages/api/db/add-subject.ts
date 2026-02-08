// src/pages/api/db/add-subject.ts
import type { APIRoute } from 'astro';
import { getSupabase } from '../../../lib/db';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return new Response('JSON inválido', { status: 400 });
  }

  const name =
    typeof (payload as { name?: unknown }).name === 'string'
      ? (payload as { name?: string }).name?.trim()
      : '';
  const userId = (payload as { userId?: unknown }).userId;

  const hasValidUserId =
    typeof userId === 'string' ? userId.trim().length > 0 : typeof userId === 'number';

  if (!name || !hasValidUserId) {
    return new Response('Datos inválidos', { status: 400 });
  }

  try {
    const supabase = getSupabase();
    const { data: row, error } = await supabase
      .from('subjects')
      .insert({
        name,
        user_id: String(userId)
      })
      .select('id, name, user_id')
      .single();

    if (error) {
      console.error('Error guardando en Supabase', error);
      return new Response('Error guardando en la base de datos', { status: 500 });
    }

    return new Response(
      JSON.stringify({ id: row.id, name: row.name, user_id: row.user_id }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error guardando materia', error);
    return new Response('Error guardando en la base de datos', { status: 500 });
  }
};
