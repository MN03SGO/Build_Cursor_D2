# MentorAI
Proyecto MentorAI (Astro, Supabase, Vercel). Base de datos local opcional: **proyectoBD**.

---

## ¿Qué significa `mentorai@0.1.0 db:local:up`?

Cuando ejecutas `npm run db:local:up` en la terminal verás algo como:

```text
> mentorai@0.1.0 db:local:up
> docker compose -f docker-compose.local-db.yml up -d
```

- **mentorai** = nombre del proyecto en `package.json` (`"name": "mentorai"`).
- **0.1.0** = versión del proyecto en `package.json` (`"version": "0.1.0"`).
- **db:local:up** = nombre del script que se está ejecutando.

**No es el nombre de la base de datos.** La base de datos local se llama **proyectoBD** (contenedor y BD en Postgres). Los scripts relacionados con la BD local son:

| Script | Qué hace |
|--------|----------|
| `npm run db:local:up` | Levanta el contenedor de Postgres (BD **proyectoBD**) con Docker/Podman. |
| `npm run db:local:down` | Detiene y elimina el contenedor (los datos siguen en el volumen). |
| `npm run db:local:migrate` | Aplica el schema (tablas) en la BD local proyectoBD. |

---

## Base de datos local (proyectoBD, Postgres en Docker)

La app en producción usa **Supabase** (y Vercel). Para desarrollo puedes usar una base Postgres local que **no interfiere con Supabase**:

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Levantar Postgres en Docker** (contenedor y BD: **proyectoBD**, puerto 5433)
   ```bash
   npm run db:local:up
   ```
   Requiere que Docker o Podman esté instalado y el daemon/socket en marcha (ver más abajo).

3. **Aplicar el schema** (tablas `users`, `subjects`, `events`)
   ```bash
   npm run db:local:migrate
   ```

4. Opcional: en `.env` define  
   `LOCAL_PG_URL=postgresql://proyectoBD:proyectoBD_local@localhost:5433/proyectoBD`

5. **Bajar el contenedor** cuando no lo uses
   ```bash
   npm run db:local:down
   ```

La app en runtime sigue usando **Supabase**; la BD local (proyectoBD) sirve para migraciones, seeds o herramientas que hablen directo con Postgres.

---

## Docker y BD local

### ¿Tengo Docker corriendo?

- En Linux suele usarse **Podman** como compatibilidad con Docker. Comprueba si el servicio está activo:
  ```bash
  systemctl --user start podman.socket   # si usas Podman como usuario
  podman ps -a                            # listar contenedores
  ```
- Si usas Docker:
  ```bash
  sudo systemctl start docker   # según distro
  docker ps -a
  ```

Si no hay daemon/socket activo, `npm run db:local:up` fallará con un error de conexión al daemon. Arranca antes el servicio correspondiente.

### ¿Está la BD local (proyectoBD) corriendo?

- La BD local **es** el contenedor que levanta `npm run db:local:up`. No es un Postgres instalado directamente en la laptop: corre **dentro de Docker/Podman**.
- Para comprobar si está en marcha:
  ```bash
  podman ps -a
  # o
  docker ps -a
  ```
  Deberías ver un contenedor con nombre `proyectoBD-postgres-local` (o el nombre definido en `docker-compose.local-db.yml`) en estado “Up” y puerto 5433.

Si no está corriendo, ejecuta desde la raíz del proyecto:
```bash
npm run db:local:up
```
y luego, si es la primera vez o cambiaste el schema:
```bash
npm run db:local:migrate
```

---

## ¿Se puede dockerizar todo el proyecto para distintos dispositivos?

**Sí, pero con matices.**

- **Stack actual:** Astro + adapter de Vercel + Supabase + (opcional) Postgres local (proyectoBD).
- **Producción:** Pensado para desplegar en **Vercel** (serverless). No hace falta Docker en producción.
- **Dockerización completa** tendría sentido para:
  - Desarrollar igual en varios equipos (misma versión de Node, mismo Postgres).
  - Montar un entorno “todo en uno” (app + BD) en un solo `docker compose up`.

Para dockerizar la app habría que:
1. Usar un adapter de Astro que sirva la app con Node (por ejemplo `@astrojs/node`) en lugar de (o además de) Vercel para el contenedor.
2. Añadir un `Dockerfile` que haga `npm run build` y ejecute el servidor Node.
3. En un `docker-compose.yml` definir el servicio de la app + el servicio de Postgres (proyectoBD).

Así tendrías un único comando para levantar app + BD en cualquier máquina con Docker. La conexión a **Supabase** y el despliegue en **Vercel** no se tocan; son la configuración de producción actual.

---

## Supabase: local y producción

- **En local**: la app usa el mismo Supabase que configures en `.env` (SUPABASE_URL, SUPABASE_ANON_KEY). No usa la BD Postgres local (proyectoBD) para la API; esa BD local es para migraciones/scripts.
- **En producción**: al desplegar (p. ej. Vercel), la app seguirá usando Supabase (el proyecto de producción que pongas en las variables de entorno).

Si la tabla `subjects` en Supabase se creó sin las columnas de hora y ves *"Could not find the 'time_end' column"*, ejecuta en el **SQL Editor** de Supabase (en el proyecto que uses, local o prod) el SQL indicado en **`db/SUPABASE-ADD-TIME-COLUMNS.md`**.

### Login / registro con GitHub

Para que los botones **"Iniciar sesión con GitHub"** y **"Registrarse con GitHub"** funcionen:

1. En **Supabase Dashboard** → **Authentication** → **Providers** activa **GitHub** y configura Client ID / Secret de tu app de GitHub.
2. En **Authentication** → **URL Configuration** define **Site URL** y en **Redirect URLs** añade la URL de tu app (p. ej. `https://tu-app.vercel.app/**`).
3. En tu proyecto (local `.env` o Vercel **Environment Variables**) define las mismas credenciales de Supabase pero expuestas al cliente (necesarias para el flujo OAuth en el navegador):
   - `PUBLIC_SUPABASE_URL` = mismo valor que `SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY` = mismo valor que `SUPABASE_ANON_KEY`

Sin `PUBLIC_SUPABASE_URL` y `PUBLIC_SUPABASE_ANON_KEY`, los botones de GitHub mostrarán un mensaje indicando que faltan esas variables.

---

## Herramientas del proyecto

- **Astro** – Framework frontend y SSR.
- **Vercel** – Despliegue (configuración en `astro.config.mjs`; no modificar para el flujo actual).
- **Supabase** – Backend (auth, BD en la nube); la app se conecta vía `SUPABASE_URL` y `SUPABASE_ANON_KEY`.
- **Postgres** – En producción: Supabase (Postgres gestionado). En local: contenedor **proyectoBD** (Docker/Podman).
- **Otras:** Gemini/Ollama (IA), Vercel Analytics, `pg`/`dotenv` para scripts de migración local.

---

integrantes  
Jorge Majano · Carlos Ansorje · Anthony Sigaran · Alex Nulla
