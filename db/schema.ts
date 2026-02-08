/*
  Esquema para Supabase (PostgreSQL).
  Copia y pega este SQL en el editor SQL de tu proyecto Supabase:
  Dashboard → SQL Editor → New query → Pegar y ejecutar.
*/

export const schemaSql = `
-- Tabla de Usuarios (login/registro de la app)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    plan TEXT DEFAULT 'free',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla de Materias
CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    exam_date TEXT,
    priority TEXT DEFAULT 'media',
    color TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla de Eventos
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT,
    date TEXT,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para búsquedas por usuario
CREATE INDEX IF NOT EXISTS idx_subjects_user_id ON subjects(user_id);
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
`.trim();
