import type { APIRoute } from 'astro';
import { generateGeminiText } from '../../../lib/geminis';
import { isOllamaConfigured, generateOllamaText } from '../../../lib/ollama';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return new Response('JSON inválido', { status: 400 });
  }

  const message =
    typeof (payload as { message?: unknown }).message === 'string'
      ? (payload as { message?: string }).message?.trim()
      : '';
  const planValue = (payload as { plan?: unknown }).plan;
  const plan = typeof planValue === 'string' && planValue === 'premium' ? 'premium' : 'free';

  if (!message) {
    return new Response('Mensaje inválido', { status: 400 });
  }

  const prompt = `
Eres una IA de estudio. Responde en español y en tono claro.
Regla de acceso: ${
    plan === 'premium'
      ? 'Responde a nivel experto, con mayor profundidad y más ejemplos.'
      : 'Responde a nivel intermedio y de forma breve.'
  }
Pregunta del usuario: ${message}
  `.trim();

  try {
    let reply: string;
    if (isOllamaConfigured()) {
      reply = await generateOllamaText(prompt);
    } else {
      reply = await generateGeminiText(prompt);
    }
    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error generando respuesta IA', error);
    const msg = error instanceof Error ? error.message : 'Error generando respuesta IA';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
