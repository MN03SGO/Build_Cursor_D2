/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SUPABASE_URL: string;
  readonly SUPABASE_ANON_KEY: string;
  /** Opcional: conexión directa Postgres (para scripts o ORM) */
  readonly SUPABASE_DB_URL?: string;
  readonly GEMINI_API_KEY: string;
  readonly GEMINI_MODEL?: string;
  readonly VUDY_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
