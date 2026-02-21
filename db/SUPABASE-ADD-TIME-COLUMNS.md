# Añadir columnas de hora a `subjects` en Supabase

Si al guardar una materia ves:

**"Could not find the 'time_end' column of 'subjects' in the schema cache"**

es porque la tabla `subjects` en tu **proyecto de Supabase** no tiene las columnas `time_start` y `time_end`. La app **siempre** usa la base de Supabase (la de tu `.env`). Si las añadiste en DBeaver a **otra** base (p. ej. Postgres local), hay que añadirlas **en Supabase**.

---

## Cómo está montado el proyecto

- **En local (desarrollo)**: la app usa **Supabase** (SUPABASE_URL). La base Postgres local (`docker-compose.local-db.yml`) se usa solo para migraciones, **no** para guardar materias.
- **En producción**: también Supabase. Ejecuta el mismo SQL en el Supabase de producción si hace falta.

---

## Qué hacer (en Supabase, no en DBeaver/local)

1. Entra en [Supabase](https://supabase.com) → el proyecto que use tu app (el de tu `.env` → SUPABASE_URL).
2. En el menú izquierdo abre **SQL Editor**.
3. Nueva consulta, pega y ejecuta **Run**:

```sql
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS time_start TEXT;
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS time_end TEXT;
```

4. Vuelve a la app e intenta guardar la materia otra vez.

Si prefieres columnas tipo `TIME` en lugar de `TEXT`, usa en Supabase SQL Editor:

```sql
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS time_start TIME;
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS time_end TIME;
```

(La app envía strings como `"22:24"`; Postgres los acepta en columnas `TIME`.)
