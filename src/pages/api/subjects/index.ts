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
      .collection('subjects')
      .find({ user_id: userId })
      .sort({ created_at: -1 })
      .toArray();
    const mapped = data.map((item) => ({
      id: item._id.toString(),
      name: item.name,
      exam_date: item.exam_date,
      priority: item.priority ?? 'media',
      color: item.color ?? ''
    }));
    return new Response(JSON.stringify(mapped), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error cargando materias', error);
    return new Response('Error cargando materias', { status: 500 });
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
  const name =
    typeof (payload as { name?: unknown }).name === 'string'
      ? (payload as { name?: string }).name?.trim()
      : '';
  const examDate =
    typeof (payload as { examDate?: unknown }).examDate === 'string'
      ? (payload as { examDate?: string }).examDate
      : '';
  const priority =
    typeof (payload as { priority?: unknown }).priority === 'string'
      ? (payload as { priority?: string }).priority
      : 'media';
  const color =
    typeof (payload as { color?: unknown }).color === 'string'
      ? (payload as { color?: string }).color
      : '';

  if (!userId || !name || !examDate) {
    return new Response('Datos inválidos', { status: 400 });
  }

  try {
    const db = await getDb();
    const result = await db.collection('subjects').insertOne({
      user_id: userId,
      name,
      exam_date: examDate,
      priority,
      color,
      created_at: new Date()
    });

    return new Response(
      JSON.stringify({
        id: result.insertedId.toString(),
        name,
        exam_date: examDate,
        priority,
        color
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creando materia', error);
    return new Response('Error creando materia', { status: 500 });
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
  const name =
    typeof (payload as { name?: unknown }).name === 'string'
      ? (payload as { name?: string }).name?.trim()
      : '';
  const examDate =
    typeof (payload as { examDate?: unknown }).examDate === 'string'
      ? (payload as { examDate?: string }).examDate
      : '';
  const priority =
    typeof (payload as { priority?: unknown }).priority === 'string'
      ? (payload as { priority?: string }).priority
      : 'media';
  const color =
    typeof (payload as { color?: unknown }).color === 'string'
      ? (payload as { color?: string }).color
      : '';

  if (!id || !userId || !name || !examDate) {
    return new Response('Datos inválidos', { status: 400 });
  }

  try {
    const db = await getDb();
    await db.collection('subjects').updateOne(
      { _id: new ObjectId(id), user_id: userId },
      { $set: { name, exam_date: examDate, priority, color } }
    );

    return new Response(
      JSON.stringify({
        id,
        name,
        exam_date: examDate,
        priority,
        color
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error actualizando materia', error);
    return new Response('Error actualizando materia', { status: 500 });
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
    await db.collection('subjects').deleteOne({ _id: new ObjectId(id), user_id: userId });
    return new Response(JSON.stringify({ id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error eliminando materia', error);
    return new Response('Error eliminando materia', { status: 500 });
  }
};
