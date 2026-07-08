# Guía de implementación paso a paso

## 1. Objetivo

Esta guía traduce el roadmap en pasos técnicos concretos para construir el producto de forma ordenada, evitando deuda técnica prematura.

---

# 2. Orden técnico recomendado

```text
1. Crear monorepo
2. Configurar base de datos
3. Implementar autenticación
4. Implementar multi-tenant
5. Implementar planes y límites
6. Implementar búsquedas
7. Implementar geo resolver simple
8. Implementar scraping planner
9. Implementar scheduler y colas
10. Implementar primer scraper adapter
11. Implementar normalización
12. Implementar deduplicación básica
13. Implementar matching
14. Implementar pipeline comercial
15. Implementar alertas
16. Implementar scoring básico
17. Añadir IA asistida
18. Añadir comunicaciones
19. Evolucionar a CRM
```

---

# 3. Paso 1 — Monorepo

## Crear estructura

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
  docs/
```

## Recomendación

Usar `pnpm workspaces`.

No mezclar el código del scraper dentro de la API.

---

# 4. Paso 2 — Base de datos y Prisma

## Crear paquete database

```text
packages/database/
  prisma/
    schema.prisma
    migrations/
  src/
    client.ts
```

## Implementar primero

```text
tenants
users
tenant_users
plans
subscription_limits
audit_logs
```

## Regla

Toda tabla privada debe tener `tenant_id`.

---

# 5. Paso 3 — API NestJS

## Crear módulos base

```text
auth
tenants
users
plans
audit
```

## Middleware/contexto tenant

Cada request autenticada debe resolver:

```text
user_id
tenant_id
role
plan_limits
```

## Validaciones

- usuario pertenece al tenant;
- rol permite la acción;
- tenant activo;
- plan permite la operación.

---

# 6. Paso 4 — Frontend base

## Pantallas iniciales

```text
/login
/dashboard
/searches
/searches/new
/opportunities
/settings/users
/settings/billing
```

## Componentes comunes

```text
Sidebar
Topbar
DataTable
FormField
StatusBadge
PlanLimitBadge
EmptyState
ConfirmDialog
```

---

# 7. Paso 5 — Búsquedas de cliente

## Backend

Módulo:

```text
searches
```

Endpoints:

```text
GET /searches
POST /searches
GET /searches/:id
PATCH /searches/:id
DELETE /searches/:id
POST /searches/:id/activate
POST /searches/:id/deactivate
```

## Validaciones

Antes de crear:

```text
max_active_searches
max_radius_km
max_sources
min_refresh_interval
```

## Evento posterior

Al crear/editar/desactivar:

```text
enqueue('recalculate-scrape-plans')
```

---

# 8. Paso 6 — Geo resolver MVP

## MVP simple

No empezar con un sistema geográfico complejo.

Inicialmente:

```text
city
province
center_lat
center_lng
radius_km
```

## Función mínima

```text
resolveGeoCoverage(location, radius) -> geo_area / geo_cells
```

## Futuro

Cambiar internamente a:

```text
H3/geohash/grid propio
```

sin cambiar la experiencia del usuario.

---

# 9. Paso 7 — Scraping planner

## Módulo

```text
scraping-planner
```

## Funciones

```text
createScrapeDemandsForSearch(searchId)
removeScrapeDemandsForSearch(searchId)
recalculateScrapePlans()
deactivateUnusedScrapePlans()
```

## Reglas

- El planner lee búsquedas/demandas.
- El planner crea planes técnicos.
- El planner no ejecuta scraping.
- El scheduler ejecuta los planes.

---

# 10. Paso 8 — Scheduler + BullMQ

## Queues iniciales

```text
scrape-source
match-listing
send-notification
```

## Scheduler

Proceso cada X minutos:

```text
get active scrape_plans due
create scrape_jobs
enqueue scrape-source
```

## Reglas

- No crear jobs duplicados si ya hay uno running.
- Registrar errores.
- Reintentos controlados.
- Backoff en fuentes inestables.

---

# 11. Paso 9 — Primer scraper adapter

## No intentar todas las fuentes a la vez

Implementar una fuente inicial y validar el flujo completo.

## Interfaz común

```text
interface SourceAdapter {
  search(plan): Promise<RawListing[]>
  parse(raw): ParsedListing
  normalize(parsed): NormalizedListing
}
```

## Reglas

- Guardar raw payload.
- Guardar URL.
- Guardar fecha de detección.
- Guardar fuente.
- No asignar tenant dentro del adapter.

---

# 12. Paso 10 — Normalización

## Objetivo

Convertir datos de fuentes distintas a un modelo común.

Campos mínimos:

```text
title
description
price
operation_type
property_type
city
province
lat
lng
rooms
bathrooms
area_m2
seller_type
url
source_id
external_id
```

## seller_type

Valores:

```text
private
professional
unknown
```

No asumir que siempre se puede saber con certeza.

---

# 13. Paso 11 — Deduplicación básica

## MVP

Deduplicar por:

```text
source_id + external_id
url
hash normalizado
```

## Hash normalizado

Puede incluir:

```text
normalized_title
price
city
area_m2
rooms
property_type
```

## Futuro

Añadir:

- comparación de fotos;
- similitud textual;
- distancia geográfica;
- histórico de precio;
- detección cross-source.

---

# 14. Paso 12 — Matching

## Módulo

```text
matching
```

## Entrada

```text
source_listing_id
```

## Salida

```text
tenant_listing_matches
```

## Lógica

```text
buscar búsquedas activas cercanas
validar operación
validar tipo
validar precio
validar fuente
validar límites del tenant
crear match si no existe
```

## Regla

No crear oportunidades automáticamente para todo. Primero crear match. Convertir a oportunidad si:

- score alto;
- usuario lo acepta;
- regla de plan lo permite;
- configuración del tenant lo indica.

---

# 15. Paso 13 — Pipeline comercial

## Módulo

```text
opportunities
activities
tasks
```

## Funciones

```text
convertMatchToOpportunity
assignOpportunity
changeStatus
addNote
createTask
completeTask
registerCall
markDoNotContact
```

## Regla

Cada acción genera `activity`.

---

# 16. Paso 14 — Alertas

## MVP

Alertas por email o notificación interna.

## Reglas

- No alertar todos los matches.
- Alertar solo nuevos o prioritarios.
- Respetar preferencias del usuario.
- Respetar límites del plan.

## Futuro

- digest diario;
- alertas instantáneas;
- WhatsApp interno;
- integración Slack/Telegram.

---

# 17. Paso 15 — Scoring básico

## Factores MVP

```text
seller_type = private
listing_age
distance_to_search_center
price_in_target_range
property_type_match
source_quality
```

## Salida

```text
score 0-100
reasons[]
```

Ejemplo:

```text
score: 82
reasons:
- Particular detectado
- Precio dentro del rango objetivo
- Zona exacta de búsqueda
- Anuncio publicado recientemente
```

---

# 18. Paso 16 — IA asistida

## Primeras funciones útiles

```text
generar resumen del inmueble
generar guion de llamada
generar mensaje editable
resumir actividad
recomendar siguiente acción
```

## Regla

Toda salida comercial debe ser editable y revisada por humano antes de enviar.

---

# 19. Paso 17 — Comunicaciones

## Primera implementación

```text
click-to-call
registro manual de llamada
plantillas de mensaje copiables
email interno
```

## Después

```text
WhatsApp Business oficial
Twilio Voice
transcripción
resumen IA
```

## Restricción

No vender ni implementar como funcionalidad principal el envío automático de WhatsApps fríos a propietarios scrapeados.

---

# 20. Testing

## Tests mínimos

```text
unit tests para planners
unit tests para matching
unit tests para límites de plan
integration tests para create search -> scrape demand -> scrape plan
integration tests para listing -> match -> opportunity
```

## Casos críticos

- Dos tenants buscan la misma zona.
- Un tenant supera límite de búsquedas.
- Un listing coincide con varias búsquedas.
- Un listing duplicado no crea match duplicado.
- Un tenant no puede ver matches de otro.
- Al cancelar una búsqueda, se desactivan demands.
- Al quedar una zona sin demanda, se desactiva scrape_plan.

---

# 21. Observabilidad mínima

Implementar desde el inicio:

```text
logs estructurados
Sentry
job status dashboard
scrape error logs
audit logs
```

Métricas:

```text
jobs ejecutados
jobs fallidos
listings detectados
matches creados
oportunidades creadas
alertas enviadas
uso por tenant
```

---

# 22. Checklist MVP

## Producto

```text
[ ] Cliente puede iniciar sesión
[ ] Cliente puede crear búsqueda
[ ] Sistema agrupa demanda
[ ] Scheduler genera jobs
[ ] Worker captura listings
[ ] Sistema normaliza
[ ] Sistema deduplica
[ ] Sistema crea matches privados
[ ] Cliente ve matches
[ ] Cliente convierte match a oportunidad
[ ] Agente cambia estados
[ ] Se registran notas/tareas
[ ] Se envían alertas básicas
```

## Técnico

```text
[ ] Multi-tenant seguro
[ ] Límites por plan
[ ] Audit log
[ ] Colas funcionando
[ ] Reintentos controlados
[ ] Workers separados
[ ] Logs de scraping
[ ] Backups DB
[ ] Sentry
```

---

# 23. Mala implementación a evitar

No hacer:

```text
scraper por cliente
API que también scrapea
sin colas
sin límites de plan
sin audit log
sin separación global/privado
sin deduplicación
sin snapshots
sin control legal de comunicaciones
```

---

# 24. Implementación correcta resumida

```text
Cliente crea búsqueda
    ↓
Geo resolver calcula cobertura
    ↓
Scrape demands registran necesidad
    ↓
Planner agrupa demanda
    ↓
Scheduler crea jobs
    ↓
Workers capturan globalmente
    ↓
Normalizador/deduplicador limpian datos
    ↓
Matching reparte por tenant
    ↓
Pipeline comercial gestiona oportunidades
```
