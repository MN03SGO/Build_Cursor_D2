import type { APIRoute } from 'astro';
import { generateGeminiText } from '../../../lib/geminis';

type StudyRequest = {
  topic?: unknown;
  level?: unknown;
  goals?: unknown;
  weeks?: unknown;
  hoursPerWeek?: unknown;
  plan?: unknown;
};

export const POST: APIRoute = async ({ request }) => {
  let payload: StudyRequest;

  try {
    payload = (await request.json()) as StudyRequest;
  } catch {
    return new Response('JSON inválido', { status: 400 });
  }

  const topic = typeof payload.topic === 'string' ? payload.topic.trim() : '';
  const levelInput = typeof payload.level === 'string' ? payload.level.trim() : 'principiante';
  const goals = typeof payload.goals === 'string' ? payload.goals.trim() : '';
  const weeks = typeof payload.weeks === 'number' && payload.weeks > 0 ? payload.weeks : 4;
  const hoursPerWeek =
    typeof payload.hoursPerWeek === 'number' && payload.hoursPerWeek > 0
      ? payload.hoursPerWeek
      : 4;
  const plan = typeof payload.plan === 'string' && payload.plan === 'premium' ? 'premium' : 'free';

  const level = plan === 'free' && levelInput === 'avanzado' ? 'intermedio' : levelInput;

  if (!topic) {
    return new Response('Datos inválidos: topic es requerido', { status: 400 });
  }

  const prompt = `
Eres una IA de estudio. Crea un plan de aprendizaje en español.
Regla de acceso: ${
    plan === 'premium'
      ? 'Responde a nivel experto, con mayor profundidad y más preguntas.'
      : 'Responde en nivel intermedio y con menos preguntas.'
  }
Tema: ${topic}
Nivel: ${level}
Objetivos: ${goals || 'Mejorar comprensión y práctica'}
Duración: ${weeks} semanas, ${hoursPerWeek} horas por semana

Entrega:
1) Plan semanal con metas claras.
2) Actividades prácticas y mini-proyectos.
3) Lista corta de recursos sugeridos.
4) ${plan === 'premium' ? '10' : '5'} preguntas tipo quiz al final.
  `.trim();

  try {
    const text = await generateGeminiText(prompt);
    return new Response(JSON.stringify({ topic, level, weeks, hoursPerWeek, plan: text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error generando plan de estudio', error);
    return new Response('Error generando plan de estudio', { status: 500 });
  }
};
