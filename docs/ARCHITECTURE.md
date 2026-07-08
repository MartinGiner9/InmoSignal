# Arquitectura técnica e implementación

## 1. Decisión principal

La arquitectura recomendada es:

```text
Modular monolith para API principal
+ workers separados para scraping y jobs
+ PostgreSQL como base principal
+ Redis/BullMQ para colas
+ frontend Next.js
```

No se recomienda empezar con microservicios. Añaden complejidad prematura: despliegues separados, contratos distribuidos, observabilidad compleja y más puntos de fallo.

Tampoco se recomienda meter todo en Next.js API routes/serverless, porque el scraping, las colas y los procesos largos requieren control fino.

---

## 2. Vista general

```text
┌─────────────────────┐
│      Frontend       │
│ Next.js + shadcn/ui │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│    API Principal    │
│  NestJS Modular     │
└─────────┬───────────┘
          │
          ├──────────────┐
          ▼              ▼
┌─────────────────┐  ┌────────────────┐
│   PostgreSQL    │  │ Redis + BullMQ │
└─────────────────┘  └───────┬────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Worker Services │
                    │ Scraping/Scoring │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ External Sources │
                    │ Portales/APIs    │
                    └──────────────────┘
```

---

## 3. Monorepo recomendado

```text
real-estate-radar/
  apps/
    web/
    api/
    worker-scraper/
    worker-jobs/
  packages/
    database/
    shared/
    config/
    ui/
    eslint-config/
    tsconfig/
  docs/
    README.md
    ROADMAP.md
    ARCHITECTURE.md
```

## Herramientas

```text
pnpm workspaces
Turborepo opcional
TypeScript
Docker Compose
ESLint
Prettier
Husky/lint-staged opcional
```

---

## 4. Frontend

### Stack

```text
Next.js
TypeScript
Tailwind CSS
shadcn/ui
TanStack Query
React Hook Form
Zod
Recharts/Tremor
```

### Estructura sugerida

```text
apps/web/src/
  app/
    (public)/
      page.tsx
      pricing/page.tsx
    (auth)/
      login/page.tsx
      register/page.tsx
    (dashboard)/
      dashboard/page.tsx
      searches/page.tsx
      opportunities/page.tsx
      settings/page.tsx
  components/
  features/
    auth/
    searches/
    opportunities/
    tenants/
    billing/
  lib/
    api.ts
    auth.ts
    validators.ts
```

### Pantallas MVP

- Login.
- Dashboard.
- Búsquedas activas.
- Crear/editar búsqueda.
- Matches detectados.
- Oportunidades.
- Detalle de oportunidad.
- Usuarios.
- Ajustes de tenant.

---

## 5. Backend API

### Stack

```text
NestJS
TypeScript
Prisma
PostgreSQL
Redis
BullMQ
OpenAPI/Swagger
```

### Módulos recomendados

```text
apps/api/src/modules/
  auth/
  tenants/
  users/
  roles/
  plans/
  searches/
  geo/
  scraping-planner/
  listings/
  matching/
  opportunities/
  activities/
  notifications/
  ai/
  communications/
  billing/
  audit/
```

### Reglas de diseño

- Cada módulo debe tener su propio service/controller/repository.
- La API debe validar tenant y permisos en cada acción.
- No exponer datos globales de scraping directamente al tenant.
- Las entidades globales y privadas deben estar separadas.
- Todo cambio importante debe generar audit log.

---

## 6. Workers

### Worker de scraping

Responsable de:

- ejecutar scrape jobs;
- llamar adaptadores de fuente;
- guardar datos brutos;
- normalizar;
- lanzar deduplicación;
- emitir evento de nuevos listings.

### Worker de jobs generales

Responsable de:

- matching;
- scoring;
- alertas;
- IA;
- notificaciones;
- tareas programadas.

### Estructura

```text
apps/worker-scraper/src/
  adapters/
    idealista.adapter.ts
    fotocasa.adapter.ts
    habitaclia.adapter.ts
  jobs/
    scrape-source.job.ts
  normalizers/
  deduplication/

apps/worker-jobs/src/
  jobs/
    match-listings.job.ts
    score-opportunities.job.ts
    send-alerts.job.ts
```

---

## 7. Colas

### BullMQ queues

```text
scrape-source
normalize-listing
deduplicate-listing
match-listing
score-opportunity
send-notification
generate-ai-output
sync-communications
```

### Regla importante

Los jobs deben ser idempotentes. Si un job se reintenta, no debe duplicar datos ni crear oportunidades repetidas.

---

## 8. Flujo principal de scraping

```text
1. Scheduler revisa scrape_plans activos.
2. Crea scrape_job si toca ejecutar.
3. Encola scrape-source.
4. Worker ejecuta adaptador de fuente.
5. Guarda raw listing/snapshot.
6. Normaliza.
7. Deduplica.
8. Guarda source_listing global.
9. Encola matching.
10. Matching crea tenant_listing_matches.
11. Scoring prioriza.
12. Notificaciones avisan al tenant.
```

---

## 9. Scraping planner

### Responsabilidad

Convertir búsquedas de cliente en planes técnicos compartidos.

### Entrada

```text
tenant_searches activas
```

### Salida

```text
scrape_demands
scrape_plans
```

### Pseudocódigo

```text
function recalculateScrapePlans() {
  activeSearches = getActiveTenantSearches()

  for each search in activeSearches:
    cells = resolveGeoCells(search.center, search.radius)
    for each cell in cells:
      for each source in search.sources:
        upsertScrapeDemand(search, cell, source)

  groupedDemands = groupBy(source, cell, operationType, propertyGroup)

  for each group in groupedDemands:
    upsertScrapePlan({
      source,
      cell,
      operationType,
      propertyGroup,
      frequency: highestRequiredFrequency(group),
      activeSearchCount: group.count
    })

  deactivatePlansWithoutDemand()
}
```

---

## 10. Matching engine

### Responsabilidad

Decidir qué inmobiliarias deben ver cada listing global.

### Entrada

```text
source_listing / normalized_listing
```

### Salida

```text
tenant_listing_matches
opportunities opcionales
```

### Pseudocódigo

```text
function matchListing(listing) {
  searches = findActiveSearchesNear(listing.location)

  for each search in searches:
    if (!passesPlanLimits(search.tenant)) continue
    if (!matchesPrice(listing, search)) continue
    if (!matchesPropertyType(listing, search)) continue
    if (!matchesOperation(listing, search)) continue
    if (!matchesSource(listing, search)) continue

    createTenantListingMatch(search, listing)
  }
}
```

---

## 11. Seguridad

### Reglas mínimas

- Todas las consultas privadas deben filtrar por `tenant_id`.
- Los roles deben validarse en backend.
- Los límites de plan deben validarse en backend.
- Las acciones críticas deben auditarse.
- Los datos sensibles deben cifrarse si procede.
- No exponer URLs internas o datos de otros tenants.

### Auditoría obligatoria

Auditar:

- creación/modificación de búsqueda;
- envío de mensajes;
- llamadas;
- cambios de estado;
- asignaciones;
- eliminación de datos;
- exportaciones;
- cambios de permisos.

---

## 12. Observabilidad

Desde MVP:

```text
Sentry
logs estructurados
health checks
job dashboard
métricas básicas por fuente
```

Más adelante:

```text
OpenTelemetry
Prometheus/Grafana
alertas de error por fuente
coste por scrape_area
```

---

## 13. Despliegue MVP

### Opción práctica

```text
Frontend: Vercel
API: VPS/Render/Railway/Fly.io
Workers: mismo servidor o servicio separado
DB: PostgreSQL gestionado
Redis: gestionado
Storage: S3 compatible
```

### Docker Compose local

Servicios:

```text
postgres
redis
api
worker-scraper
worker-jobs
web
```

---

## 14. Decisiones críticas

### No hacer

- No meter scraper en API principal.
- No hacer microservicios desde el inicio.
- No usar una base por inmobiliaria al principio.
- No cobrar tarifa plana ilimitada.
- No automatizar WhatsApp/llamadas frías sin revisión.
- No acoplar tenant al scraper.

### Sí hacer

- Modular monolith.
- Workers separados.
- Datos globales + matches privados.
- Planner automático.
- Límites por plan.
- Auditoría.
- Matching después de capturar.
