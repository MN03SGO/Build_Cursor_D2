-- Schema para Postgres local (sin RLS). No usar en Supabase; ahí usar db/schema.ts (schemaSql).
-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    nombre TEXT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    plan TEXT DEFAULT 'free',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla de Materias
CREATE TABLE IF NOT EXISTS subjects (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    exam_date TEXT,
    time_start TEXT,
    time_end TEXT,
    priority TEXT DEFAULT 'media',
    color TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla de Eventos
CREATE TABLE IF NOT EXISTS events (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT,
    date TEXT,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subjects_user_id ON subjects(user_id);
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);

-- Si la tabla subjects ya existía, ejecutar en la BD local:
-- ALTER TABLE subjects ADD COLUMN IF NOT EXISTS time_start TEXT;
-- ALTER TABLE subjects ADD COLUMN IF NOT EXISTS time_end TEXT;
