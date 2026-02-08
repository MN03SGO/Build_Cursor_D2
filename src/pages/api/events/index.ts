import type { APIRoute } from 'astro';
import { getSupabase } from '../../../lib/db';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const userId = url.searchParams.get('userId');
  if (!userId) {
    return new Response('userId requerido', { status: 400 });
  }

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('events')
      .select('id, title, date, note')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error cargando eventos', error);
      return new Response('Error cargando eventos', { status: 500 });
    }

    const mapped = (data ?? []).map((item) => ({
      id: item.id,
      title: item.title,
      date: item.date,
      note: item.note ?? ''
    }));
    return new Response(JSON.stringify(mapped), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error cargando eventos', error);
    return new Response('Error cargando eventos', { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return new Response('JSON inválido', { status: 400 });
  }

  const userId =
    typeof (payload as { userId?: unknown }).userId === 'string'
      ? (payload as { userId?: string }).userId?.trim()
      : '';
  const title =
    typeof (payload as { title?: unknown }).title === 'string'
      ? (payload as { title?: string }).title?.trim()
      : '';
  const date =
    typeof (payload as { date?: unknown }).date === 'string'
      ? (payload as { date?: string }).date
      : '';
  const note =
    typeof (payload as { note?: unknown }).note === 'string'
      ? (payload as { note?: string }).note
      : '';

  if (!userId || !title || !date) {
    return new Response('Datos inválidos', { status: 400 });
  }

  try {
    const supabase = getSupabase();
    const { data: row, error } = await supabase
      .from('events')
      .insert({
        user_id: userId,
        title,
        date,
        note
      })
      .select('id, title, date, note')
      .single();

    if (error) {
      console.error('Error creando evento', error);
      return new Response('Error creando evento', { status: 500 });
    }

    return new Response(
      JSON.stringify({
        id: row.id,
        title: row.title,
        date: row.date,
        note: row.note
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creando evento', error);
    return new Response('Error creando evento', { status: 500 });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return new Response('JSON inválido', { status: 400 });
  }

  const id =
    typeof (payload as { id?: unknown }).id === 'string'
      ? (payload as { id?: string }).id?.trim()
      : '';
  const userId =
    typeof (payload as { userId?: unknown }).userId === 'string'
      ? (payload as { userId?: string }).userId?.trim()
      : '';
  const title =
    typeof (payload as { title?: unknown }).title === 'string'
      ? (payload as { title?: string }).title?.trim()
      : '';
  const date =
    typeof (payload as { date?: unknown }).date === 'string'
      ? (payload as { date?: string }).date
      : '';
  const note =
    typeof (payload as { note?: unknown }).note === 'string'
      ? (payload as { note?: string }).note
      : '';

  if (!id || !userId || !title || !date) {
    return new Response('Datos inválidos', { status: 400 });
  }

  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from('events')
      .update({ title, date, note })
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error actualizando evento', error);
      return new Response('Error actualizando evento', { status: 500 });
    }

    return new Response(
      JSON.stringify({
        id,
        title,
        date,
        note
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error actualizando evento', error);
    return new Response('Error actualizando evento', { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return new Response('JSON inválido', { status: 400 });
  }

  const id =
    typeof (payload as { id?: unknown }).id === 'string'
      ? (payload as { id?: string }).id?.trim()
      : '';
  const userId =
    typeof (payload as { userId?: unknown }).userId === 'string'
      ? (payload as { userId?: string }).userId?.trim()
      : '';

  if (!id || !userId) {
    return new Response('Datos inválidos', { status: 400 });
  }

  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error eliminando evento', error);
      return new Response('Error eliminando evento', { status: 500 });
    }

    return new Response(JSON.stringify({ id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error eliminando evento', error);
    return new Response('Error eliminando evento', { status: 500 });
  }
};
