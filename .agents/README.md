# .agents: contexto del proyecto

Esta carpeta describe **todo el sistema** (frontend `PPracticaSS` + backend `pp-backend`) para personas y agentes de IA que trabajan en el proyecto. Es contexto de referencia: no sustituye a los README de cada repositorio, solo los conecta.

## Documentos

| Documento | Qué responde |
| --- | --- |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Cómo está construido el sistema, qué módulos existen, los flujos clave (login, guardar oferta, mapa) y las decisiones transversales. |
| [MODELS.md](MODELS.md) | Tablas de PostgreSQL, relaciones, contratos de la API que consume el frontend y estados de `geocoded_addresses`. |
| [STAGES.md](STAGES.md) | En qué etapa está el proyecto, qué se completó (con evidencia) y qué falta. |

## Reglas para agentes

- `AGENTS.md` (raíz del repositorio) contiene las reglas del agente para **Next.js 16**: esta versión tiene cambios incompatibles, así que lee `node_modules/next/dist/docs/` antes de escribir código.
- El backend vive en un repositorio aparte: [pp-backend](https://github.com/AlanValerdi/pp-backend). Estos documentos lo describen, pero no lo modifican.
- Ante la duda entre un documento y el código, gana el código. Si encuentras una diferencia, corrige el documento.

## Cómo mantenerlo actualizado

Actualiza el documento correspondiente **en el mismo PR** que cambie:

| Si el PR cambia... | Actualiza |
| --- | --- |
| módulos, rutas, flujos, decisiones de autenticación o CSRF | [ARCHITECTURE.md](ARCHITECTURE.md) |
| modelos SQLModel, migraciones de Alembic o esquemas de la API (y se regenera `lib/api-types.d.ts`) | [MODELS.md](MODELS.md) |
| una etapa se completa, empieza o aparece una deuda nueva | [STAGES.md](STAGES.md) |

Al cerrar un PR, agrega su referencia (por ejemplo `AlanValerdi/PPracticaSS#6`) a la fila de la etapa en `STAGES.md`.
