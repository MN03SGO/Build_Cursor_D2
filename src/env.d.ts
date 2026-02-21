/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SUPABASE_URL: string;
  readonly SUPABASE_ANON_KEY: string;
  /** Mismas que las de arriba; necesarias en el cliente para OAuth con GitHub */
  readonly PUBLIC_SUPABASE_URL?: string;
  readonly PUBLIC_SUPABASE_ANON_KEY?: string;
  /** Opcional: conexión directa Postgres (para scripts o ORM) */
  readonly SUPABASE_DB_URL?: string;
  /** Postgres local proyectoBD (scripts db:local:migrate). Ej: postgresql://proyectoBD:proyectoBD_local@localhost:5433/proyectoBD */
  readonly LOCAL_PG_URL?: string;
  readonly GEMINI_API_KEY: string;
  readonly GEMINI_MODEL?: string;
  /** Si está definida, el chat usará Ollama en lugar de Gemini (ej: http://localhost:11434) */
  readonly OLLAMA_URL?: string;
  /** Modelo de Ollama (ej: llama3, deepseek-coder:6.7b). Por defecto: llama3 */
  readonly OLLAMA_MODEL?: string;
  readonly VUDY_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
