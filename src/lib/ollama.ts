/**
 * Integración con Ollama (Llama local).
 * Si tienes Ollama corriendo en tu PC (http://localhost:11434), el chat usará este modelo
 * en lugar de Gemini. Pon en .env: OLLAMA_URL=http://localhost:11434
 */

const ollamaUrl = typeof import.meta.env.OLLAMA_URL === 'string'
  ? import.meta.env.OLLAMA_URL.replace(/\/$/, '')
  : '';

const defaultModel =
  typeof import.meta.env.OLLAMA_MODEL === 'string' && import.meta.env.OLLAMA_MODEL.trim()
    ? import.meta.env.OLLAMA_MODEL.trim()
    : 'llama3';

export function isOllamaConfigured(): boolean {
  return Boolean(ollamaUrl?.trim());
}

export async function generateOllamaText(prompt: string, model: string = defaultModel): Promise<string> {
  if (!ollamaUrl?.trim()) {
    throw new Error('OLLAMA_URL no está definida. Añádela en .env (ej: http://localhost:11434)');
  }

  const response = await fetch(`${ollamaUrl}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt,
      stream: false
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Ollama error: ${response.status} ${text}`);
  }

  const data = (await response.json()) as { response?: string; error?: string };
  if (data.error) {
    throw new Error(data.error);
  }
  const text = data.response?.trim() ?? '';
  if (!text) {
    throw new Error('Ollama no devolvió texto');
  }
  return text;
}
