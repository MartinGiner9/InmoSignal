# Secuencia recomendada de desarrollo

## Fase 0 — Base técnica

Estado objetivo:

- Repo compila.
- Prisma valida.
- CI pasa.
- Frontend, API y workers arrancan.
- No hay scraping real.

## Fase 1 — Flujo mock completo

Objetivo:

```txt
TenantSearch
  -> ScrapeDemand
  -> ScrapePlan
  -> ScrapeRun
  -> mockAdapter
  -> SourceListing
  -> NormalizedListing
  -> TenantListingMatch
  -> Opportunity opcional
```

Agentes:

- `04-database-prisma.md`
- `05-backend-nestjs.md`
- `06-scraping-planner.md`
- `08-workers-queues.md`
- `11-qa-testing.md`

## Fase 2 — Dashboard operativo

Objetivo:

- Crear búsqueda desde UI.
- Ver búsquedas.
- Ver scrape plans generados.
- Ver matches mock.
- Cambiar estado de oportunidad.

Agentes:

- `09-frontend-nextjs.md`
- `10-ui-ux-saas.md`
- `05-backend-nestjs.md`

## Fase 3 — Primer adapter real controlado

Objetivo:

- Un único portal/fuente.
- Frecuencia baja.
- Snapshot/debug.
- Sin contacto automático.

Agentes:

- `07-scraping-adapter.md`
- `08-workers-queues.md`
- `13-security-compliance.md`
- `11-qa-testing.md`

## Fase 4 — CRM ligero

Objetivo:

- Contactos.
- Oportunidades.
- Tareas.
- Actividades.
- Asignación a agente.
- Historial.

Agentes:

- `05-backend-nestjs.md`
- `09-frontend-nextjs.md`
- `10-ui-ux-saas.md`
- `04-database-prisma.md`

## Fase 5 — Comunicaciones e IA asistida

Objetivo:

- WhatsApp solo en contextos permitidos.
- Email/recordatorios.
- Click-to-call.
- IA para resumen, scoring y guiones editables.

Agentes:

- `14-integrations-communications.md`
- `15-ai-automation.md`
- `13-security-compliance.md`
