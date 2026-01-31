import type { APIRoute } from 'astro';
import { ObjectId } from 'mongodb';
import { getDb } from '../../../lib/db';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const userId = url.searchParams.get('userId');
  if (!userId) {
    return new Response('userId requerido', { status: 400 });
  }

  try {
    const db = await getDb();
    const data = await db
      .collection('events')
      .find({ user_id: userId })
      .sort({ created_at: -1 })
      .toArray();
    const mapped = data.map((item) => ({
      id: item._id.toString(),
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
    const db = await getDb();
    const result = await db.collection('events').insertOne({
      user_id: userId,
      title,
      date,
      note,
      created_at: new Date()
    });

    return new Response(
      JSON.stringify({
        id: result.insertedId.toString(),
        title,
        date,
        note
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
    const db = await getDb();
    await db.collection('events').updateOne(
      { _id: new ObjectId(id), user_id: userId },
      { $set: { title, date, note } }
    );

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
    const db = await getDb();
    await db.collection('events').deleteOne({ _id: new ObjectId(id), user_id: userId });
    return new Response(JSON.stringify({ id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error eliminando evento', error);
    return new Response('Error eliminando evento', { status: 500 });
  }
};
