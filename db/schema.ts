
/**
 * Schema para Postgres local (sin RLS ni políticas; la app en producción usa Supabase).
 * Usado por scripts/migrate-local-db.js.
 */
export const schemaLocalSql = `
-- Tabla de Usuarios (login/registro de la app). id en BIGINT para coincidir con Supabase.
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    nombre TEXT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    plan TEXT DEFAULT 'free',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla de Materias (user_id debe ser el mismo tipo que users.id: BIGINT)
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

-- Tabla de Eventos (user_id debe ser el mismo tipo que users.id: BIGINT)
CREATE TABLE IF NOT EXISTS events (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT,
    date TEXT,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para búsquedas por usuario
CREATE INDEX IF NOT EXISTS idx_subjects_user_id ON subjects(user_id);
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
`.trim();

export const schemaSql = `
-- Tabla de Usuarios (login/registro de la app). id en BIGINT para coincidir con Supabase.
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    nombre TEXT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    plan TEXT DEFAULT 'free',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla de Materias (user_id debe ser el mismo tipo que users.id: BIGINT)
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

-- Tabla de Eventos (user_id debe ser el mismo tipo que users.id: BIGINT)
CREATE TABLE IF NOT EXISTS events (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT,
    date TEXT,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para búsquedas por usuario
CREATE INDEX IF NOT EXISTS idx_subjects_user_id ON subjects(user_id);
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);

-- Permitir que tu app (clave anon) lea y escriba en las tablas.
-- Sin estas políticas, Supabase bloquea todo por defecto (RLS).
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_all_users" ON users;
DROP POLICY IF EXISTS "anon_all_subjects" ON subjects;
DROP POLICY IF EXISTS "anon_all_events" ON events;
CREATE POLICY "anon_all_users" ON users FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_subjects" ON subjects FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_events" ON events FOR ALL TO anon USING (true) WITH CHECK (true);
`.trim();

/** Si la tabla subjects ya existía, añade columnas de hora en Supabase (SQL Editor): */
export const fixSubjectsTimeSql = `
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS time_start TEXT;
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS time_end TEXT;
`.trim();

/**
 * Si la tabla "users" ya existía con otras columnas y el registro falla,
 * ejecuta esto en Supabase (SQL Editor) para añadir las que faltan:
 */
export const fixUsersTableSql = `
ALTER TABLE users ADD COLUMN IF NOT EXISTS nombre TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free';
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
-- Luego asegura las políticas RLS:
DROP POLICY IF EXISTS "anon_all_users" ON users;
CREATE POLICY "anon_all_users" ON users FOR ALL TO anon USING (true) WITH CHECK (true);
`.trim();
