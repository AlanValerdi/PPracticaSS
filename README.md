# PPracticaSS

Explora ofertas de servicio social y prácticas profesionales por área de estudio. PPracticaSS es la aplicación web del proyecto: consulta el catálogo de [pp-backend](https://github.com/AlanValerdi/pp-backend), muestra los detalles de cada programa y permite guardar ofertas al iniciar sesión con Google.

## Funcionalidades

| Función | Estado actual |
| --- | --- |
| Catálogo, áreas y detalle de ofertas | Datos de la API; el catálogo se alimenta del SIIAA mediante el backend. |
| Inicio de sesión con Google y ofertas guardadas | Integrados con la API y sus sesiones. |
| Mapa | Muestra ubicaciones de ejemplo definidas en el frontend. |
| Ofertas sugeridas a partir del CV | Demostración: el PDF permanece en el navegador y el análisis, el perfil y las recomendaciones son simulados. |
| Panel (`/dashboard`) | Estructura visual sin métricas funcionales. |

## Contenido

- [Funcionalidades](#funcionalidades)
- [Resumen de arquitectura](#resumen-de-arquitectura)
- [Requisitos](#requisitos)
- [Inicio rápido](#inicio-rápido)
- [Recorrido por la aplicación](#recorrido-por-la-aplicación)
- [Solución de problemas](#solución-de-problemas)
- [Desarrollo y estado del proyecto](#desarrollo-y-estado-del-proyecto)

## Resumen de arquitectura

La aplicación usa el App Router de Next.js. Las páginas componen la interfaz con componentes reutilizables; las funciones de `lib/api/` consultan el backend y los tipos generados de OpenAPI describen sus respuestas. FastAPI gestiona el catálogo, la autenticación y los guardados en PostgreSQL.

```text
Navegador
   │
   ▼
Páginas y componentes de Next.js
   ├─ Consultas del servidor ────────────┐
   ├─ Acciones de guardar/quitar ────────┤
   └─ /api/backend/* (proxy de sesión) ──┤
                                         ▼
                                API de pp-backend
                                         │
                                         ▼
                                    PostgreSQL
```

### Estructura del proyecto

```text
app/               Rutas, páginas y layouts del App Router
  (core)/          Catálogo, detalle, guardados, mapa y CV
  actions/         Acciones del servidor para guardar y quitar ofertas
components/        Componentes de pantalla y controles reutilizables
  ui/              Elementos básicos de interfaz
hooks/             Estado de sesión del navegador con SWR
lib/api/           Consultas al backend desde el servidor
lib/api-types.d.ts Contrato TypeScript generado desde OpenAPI
lib/mapPinsOffers.ts Datos de ejemplo usados por el mapa
```

### Responsabilidades y flujo de datos

- Las páginas de catálogo, área, detalle y guardados obtienen datos de la API desde el servidor. `API_BASE_URL` indica dónde encontrarla.
- `next.config.ts` reescribe `/api/backend/:path*` hacia `/api/v1/:path*` del backend para las llamadas de autenticación realizadas por el navegador. `hooks/use-auth.ts` consulta la sesión con SWR.
- El backend entrega la cookie `pp_session`. Las acciones en `app/actions/` la reenvían al guardar o quitar una oferta y actualizan las páginas afectadas.
- `lib/api-types.d.ts` contiene los tipos de respuesta generados desde OpenAPI. Si cambia el contrato, sigue las [instrucciones de regeneración del backend](https://github.com/AlanValerdi/pp-backend#tipos-typescript-para-el-frontend).
- El mapa usa marcadores de ejemplo en `lib/mapPinsOffers.ts`. La página de CV mantiene el PDF en el navegador y muestra resultados simulados; estos flujos no consultan modelos de recomendación ni datos geográficos del backend.

## Requisitos

- Node.js 20.9 o posterior y `pnpm` 11.20.0 (versión indicada en `package.json`).
- El repositorio [pp-backend](https://github.com/AlanValerdi/pp-backend), Docker y Docker Compose para la ruta de arranque descrita abajo.
- Credenciales OAuth de Google **solo** si vas a probar el inicio de sesión y las ofertas guardadas. El catálogo puede consultarse sin iniciar sesión.

## Inicio rápido

Estos pasos suponen que `PPracticaSS` y `pp-backend` están en el mismo directorio. Si ya tienes la API en marcha, empieza en el paso 2 y usa su URL en `API_BASE_URL`.

### 1. Levanta el backend

Desde `pp-backend`, copia la configuración de ejemplo si todavía no tienes `.env`:

```bash
test -e .env || cp .env.example .env
```

Genera un secreto con `python3 -c 'import secrets; print(secrets.token_urlsafe(32))'` y agrégalo como `OAUTH_SESSION_SECRET` al `.env` del backend. Esta variable es obligatoria para iniciar la API, aunque no uses Google. Después, desde `pp-backend`, ejecuta:

```bash
docker compose up -d --build
```

Comprueba que responda en [http://localhost:8001/health](http://localhost:8001/health); la documentación de la API está en [http://localhost:8001/docs](http://localhost:8001/docs). El contenedor aplica las migraciones al arrancar.

Para probar el acceso con Google, configura también `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` en el `.env` del backend. Registra `http://localhost:3000/api/backend/auth/google/callback` como URI de redirección autorizada en tu cliente OAuth. El backend usa esa URL por defecto; `FRONTEND_URL` apunta a `http://localhost:3000` por defecto.

Una base nueva puede tener el catálogo vacío. La [guía del backend](https://github.com/AlanValerdi/pp-backend#scraper) explica cómo cargarlo con el scraper.

### 2. Configura y ejecuta el frontend

Desde `PPracticaSS`, crea `.env.local` con esta línea:

```dotenv
API_BASE_URL=http://localhost:8001
```

Después ejecuta:

```bash
pnpm install
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000). `API_BASE_URL` es una variable del servidor: debe apuntar a la API accesible desde el proceso de Next.js. Si ejecutas FastAPI localmente con `uv run fastapi dev`, normalmente será `http://localhost:8000`.

## Recorrido por la aplicación

1. En `/`, elige un área para ver sus ofertas.
2. En `/facultad/[areaId]`, consulta la tabla de programas; abre una oferta para ver su descripción, supervisor, actividades y datos de contacto.
3. Inicia sesión con Google desde la barra lateral para guardar ofertas. En `/guardados` puedes volver a verlas o quitarlas de tu lista.
4. En `/mapa`, explora el mapa de demostración. Sus marcadores no provienen del catálogo de la API.
5. En `/analisis-cv`, sube un PDF de hasta 10 MB para ver una demostración de resumen y recomendaciones. La página no extrae datos reales del documento ni lo envía al backend; los guardados de esta sección son solo locales a la demostración.

El botón **Aplicar** de una oferta abre un borrador de correo cuando la oferta tiene dirección de contacto. **Ver en mapa** abre una búsqueda de la dirección; ninguna de estas acciones envía una solicitud de postulación desde la aplicación.

## Solución de problemas

| Síntoma | Qué revisar |
| --- | --- |
| Next.js falla al arrancar con `Falta configurar API_BASE_URL` | Crea `.env.local` con la URL de la API y reinicia `pnpm dev`. |
| La página principal no carga o no muestra áreas | Comprueba `/health` y `/api/v1/catalog` en el backend. Si el catálogo está vacío, sigue la sección del scraper de su guía. |
| El backend falla al iniciar con `Falta configurar OAUTH_SESSION_SECRET` | Agrega esa variable a su `.env` y vuelve a levantarlo. |
| Google no inicia sesión | Revisa las credenciales OAuth y que la URI de redirección autorizada coincida exactamente con la indicada arriba. |
| Los guardados piden iniciar sesión de nuevo | La sesión pudo expirar; vuelve a entrar con Google. |

## Desarrollo y estado del proyecto

El frontend usa Next.js 16, React 19, TypeScript y Tailwind CSS. Los comandos disponibles son `pnpm dev`, `pnpm build`, `pnpm start` y `pnpm lint`. Para comprobar cambios locales, ejecuta `pnpm lint` y `pnpm exec tsc --noEmit --incremental false`.

El catálogo, el detalle y los guardados funcionan con la API. El mapa, el panel y las recomendaciones de CV siguen en fase de demostración; no deben interpretarse como datos o análisis reales. La configuración, migraciones, scraper y pruebas del servicio están en el [README de pp-backend](https://github.com/AlanValerdi/pp-backend).
