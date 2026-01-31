// src/lib/db.ts
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;

if (!connectionString || !connectionString.trim()) {
  throw new Error("DATABASE_URL no está definida en el archivo .env");
}

// Cliente de conexión para el servidor de Astro
export const sql = postgres(connectionString, {
  ssl: 'require', // Necesario para la mayoría de DBs en la nube como Neon o Supabase
  max: 10         // Límite de conexiones para no saturar el pool
});