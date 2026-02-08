type GeminiTextPart = { text?: string };
type GeminiContent = { parts?: GeminiTextPart[] };
type GeminiCandidate = { content?: GeminiContent };
type GeminiResponse = { candidates?: GeminiCandidate[]; promptFeedback?: unknown };

const model = 'gemini-2.5-flash';

function getApiKey(): string {
  const apiKey = import.meta.env.GEMINI_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    throw new Error('GEMINI_API_KEY no está definida en el archivo .env');
  }
  return apiKey;
}

const baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';

export async function generateGeminiText(prompt: string) {
  const apiKey = getApiKey();
  const response = await fetch(`${baseUrl}/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 800
      }
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini error: ${response.status} ${errorBody}`);
  }

  const data = (await response.json()) as GeminiResponse;
  const text =
    data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .filter(Boolean)
      .join('') ?? '';

  if (!text) {
    throw new Error('Gemini no devolvió contenido');
  }

  return text;
}