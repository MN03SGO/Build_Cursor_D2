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
      .from('subjects')
      .select('id, name, exam_date, time_start, time_end, priority, color')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error cargando materias', error);
      return new Response('Error cargando materias', { status: 500 });
    }

    const mapped = (data ?? []).map((item) => ({
      id: item.id,
      name: item.name,
      exam_date: item.exam_date,
      time_start: item.time_start ?? '',
      time_end: item.time_end ?? '',
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
  // Tabla subjects usa exam_date (no "date"). Frontend envía examDate (camelCase).
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
  const timeStart =
    typeof (payload as { time_start?: unknown }).time_start === 'string'
      ? (payload as { time_start?: string }).time_start?.trim()
      : '';
  const timeEnd =
    typeof (payload as { time_end?: unknown }).time_end === 'string'
      ? (payload as { time_end?: string }).time_end?.trim()
      : '';

  if (!userId) {
    return new Response('Debes iniciar sesión para crear una materia.', { status: 400 });
  }
  if (!name) {
    return new Response('Escribe el nombre de la materia.', { status: 400 });
  }
  if (!examDate) {
    return new Response('Elige la fecha de examen.', { status: 400 });
  }

  const colorByPriority =
    priority === 'alta' ? '#dc2626' : priority === 'baja' ? '#16a34a' : '#eab308';
  const finalColor = (color && color.trim()) ? color : colorByPriority;

  try {
    const supabase = getSupabase();
    const { data: row, error } = await supabase
      .from('subjects')
      .insert({
        user_id: userId,
        name,
        exam_date: examDate,
        time_start: timeStart || null,
        time_end: timeEnd || null,
        priority,
        color: finalColor
      })
      .select('id, name, exam_date, time_start, time_end, priority, color')
      .single();

    if (error) {
      console.error('Error creando materia', error);
      const msg = error?.message || 'Error creando materia';
      return new Response(msg, { status: 500 });
    }

    return new Response(
      JSON.stringify({
        id: row.id,
        name: row.name,
        exam_date: row.exam_date,
        time_start: row.time_start ?? '',
        time_end: row.time_end ?? '',
        priority: row.priority,
        color: row.color
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
  const timeStartPut =
    typeof (payload as { time_start?: unknown }).time_start === 'string'
      ? (payload as { time_start?: string }).time_start?.trim()
      : '';
  const timeEndPut =
    typeof (payload as { time_end?: unknown }).time_end === 'string'
      ? (payload as { time_end?: string }).time_end?.trim()
      : '';

  if (!id || !userId || !name || !examDate) {
    return new Response('Datos inválidos', { status: 400 });
  }

  const colorByPriorityPut =
    priority === 'alta' ? '#dc2626' : priority === 'baja' ? '#16a34a' : '#eab308';
  const finalColorPut = (color && color.trim()) ? color : colorByPriorityPut;

  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from('subjects')
      .update({
        name,
        exam_date: examDate,
        time_start: timeStartPut || null,
        time_end: timeEndPut || null,
        priority,
        color: finalColorPut
      })
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error actualizando materia', error);
      return new Response('Error actualizando materia', { status: 500 });
    }

    return new Response(
      JSON.stringify({
        id,
        name,
        exam_date: examDate,
        time_start: timeStartPut,
        time_end: timeEndPut,
        priority,
        color: finalColorPut
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
    const supabase = getSupabase();
    const { error } = await supabase
      .from('subjects')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error eliminando materia', error);
      return new Response('Error eliminando materia', { status: 500 });
    }

    return new Response(JSON.stringify({ id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error eliminando materia', error);
    return new Response('Error eliminando materia', { status: 500 });
  }
};
