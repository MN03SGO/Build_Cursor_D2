/**
 * Aplica el schema local (db/schema-local.sql) a la base Postgres local.
 * Requiere: npm run db:local:up y variable LOCAL_PG_URL en .env (o usa la URL por defecto).
 *
 * Uso: npm run db:local:migrate
 */
import 'dotenv/config';
import pg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const defaultUrl = 'postgresql://proyectoBD:proyectoBD_local@localhost:5433/proyectoBD';
const connectionString = process.env.LOCAL_PG_URL || defaultUrl;

async function main() {
  const sqlPath = join(__dirname, '..', 'db', 'schema-local.sql');
  const sql = readFileSync(sqlPath, 'utf8');

  const client = new pg.Client({ connectionString });
  try {
    await client.connect();
    await client.query(sql);
    console.log('OK: Schema aplicado en la BD local.');
  } catch (err) {
    const msg = err && typeof err.message === 'string' ? err.message : String(err);
    console.error('Error aplicando schema:', msg || 'Sin detalles. ¿Está Postgres local arriba? (npm run db:local:up)');
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
