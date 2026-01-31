/*
  Esquema base PostgreSQL para la app.
  Puedes ejecutar este SQL directamente en tu instancia.
*/

export const schemaSql = `
-- Tabla de Usuarios (Conexión con Vudy)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    vudy_customer_id VARCHAR(100),
    plan_status VARCHAR(50) DEFAULT 'free' -- 'free' o 'premium'
);

-- Tabla de Materias
CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    color VARCHAR(20),
    difficulty INTEGER DEFAULT 3 -- Escala del 1 al 5
);

-- Tabla de Exámenes
CREATE TABLE IF NOT EXISTS exams (
    id SERIAL PRIMARY KEY,
    subject_id INTEGER REFERENCES subjects(id),
    title VARCHAR(100),
    date TIMESTAMP NOT NULL,
    priority_level VARCHAR(20) -- 'alta', 'media', 'baja'
);

-- Tabla de Sesiones de Estudio (El historial para la IA)
CREATE TABLE IF NOT EXISTS study_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    subject_id INTEGER REFERENCES subjects(id),
    duration_minutes INTEGER,
    method_used VARCHAR(50), -- 'Pomodoro', 'Feynman', etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`.trim();