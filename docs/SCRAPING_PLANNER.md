# Scraping Planner — Diseño detallado

## 1. Problema que resuelve

Si cada inmobiliaria genera sus propios scrapers, el sistema no escala.

Ejemplo malo:

```text
Cliente A busca Murcia → scraper Murcia A
Cliente B busca Murcia → scraper Murcia B
Cliente C busca Murcia → scraper Murcia C
```

Esto multiplica costes, repite capturas, aumenta bloqueos y complica el mantenimiento.

La solución es un **Scraping Planner** que agregue la demanda de todos los clientes.

---

## 2. Principio fundamental

```text
El cliente configura búsquedas comerciales.
La plataforma genera automáticamente planes técnicos de scraping.
```

Separación obligatoria:

```text
tenant_search != scrape_job
```

---

## 3. Conceptos

## Tenant Search

Búsqueda configurada por una inmobiliaria.

Ejemplo:

```text
Murcia centro, radio 5 km, pisos en venta hasta 180.000 €, particulares
```

## Scrape Demand

Demanda técnica derivada de una búsqueda.

Ejemplo:

```text
Esta búsqueda necesita cubrir Murcia Cell 001 en Idealista para venta de viviendas.
```

## Scrape Plan

Agrupación técnica compartida.

Ejemplo:

```text
Idealista + Murcia Cell 001 + venta + viviendas + cada 2h
```

## Scrape Job

Ejecución concreta.

Ejemplo:

```text
Ejecutar scrape plan X el 2026-07-07 a las 10:00
```

---

# 4. Flujo completo

```text
1. Cliente crea búsqueda.
2. Sistema valida límites del plan.
3. Sistema geocodifica zona/radio.
4. Sistema calcula geo_cells afectadas.
5. Crea scrape_demands.
6. Planner agrupa demandas.
7. Crea o actualiza scrape_plans.
8. Scheduler genera scrape_jobs.
9. Workers ejecutan jobs.
10. Listings se guardan globalmente.
11. Matching reparte resultados a tenants.
```

---

# 5. Algoritmo inicial para MVP

## 5.1. Resolución geográfica simple

Para MVP no hace falta empezar con H3/geohash.

Se puede usar:

```text
municipio + barrio/zona + radio
```

Ejemplo:

```text
Murcia centro
Cartagena
Molina de Segura
Madrid Salamanca
Barcelona Eixample
```

## 5.2. Agrupación

Agrupar por:

```text
source_id
geo_area_id / geo_cell_id
operation_type
property_group
frequency_level
```

## 5.3. Frecuencia

Si varias búsquedas comparten zona pero tienen frecuencias distintas, el scrape plan debe usar la frecuencia más exigente permitida.

Ejemplo:

```text
Cliente A: Murcia cada 12h
Cliente B: Murcia cada 4h
Cliente C: Murcia cada 2h

Scrape plan: Murcia cada 2h
```

Pero el matching puede entregar resultados según el plan de cada cliente.

---

# 6. Algoritmo avanzado futuro

Cuando el volumen crezca, usar:

```text
geohash
H3
grid propio
```

Ventaja:

- agrupación más precisa;
- control de zonas grandes;
- pricing por cobertura;
- evitar que Madrid/Barcelona cuesten igual que ciudades pequeñas;
- mejor escalabilidad.

## Celdas

Una búsqueda se traduce a N celdas.

Ejemplo:

```text
Murcia centro radio 5 km = 3 celdas
Madrid centro radio 5 km = 12 celdas
Barcelona Eixample radio 5 km = 10 celdas
```

---

# 7. Validación de límites

Antes de crear una búsqueda, validar:

```text
max_active_searches
max_radius_km
max_sources
min_refresh_interval
max_geo_coverage_credits
max_monthly_new_listings
```

Si el cliente excede:

- bloquear creación;
- sugerir upgrade;
- permitir solicitud comercial;
- reducir frecuencia automáticamente.

---

# 8. Pseudocódigo de creación de búsqueda

```text
function createTenantSearch(input, tenantId) {
  limits = getTenantLimits(tenantId)

  assertActiveSearchesWithinLimit(tenantId, limits)
  assertRadiusWithinLimit(input.radius, limits)
  assertSourcesWithinLimit(input.sources, limits)
  assertFrequencyWithinLimit(input.frequency, limits)

  geoCoverage = resolveGeoCoverage(input.location, input.radius)
  assertCoverageWithinLimit(geoCoverage, limits)

  search = saveTenantSearch(input, tenantId)

  createScrapeDemands(search, geoCoverage)

  enqueueRecalculateScrapePlans()

  audit('tenant_search.created', search)

  return search
}
```

---

# 9. Pseudocódigo de recalcular scrape plans

```text
function recalculateScrapePlans() {
  activeDemands = getActiveScrapeDemands()

  groups = groupDemands(activeDemands, [
    'source_id',
    'geo_cell_id',
    'operation_type',
    'property_group'
  ])

  for each group in groups:
    plan = upsertScrapePlan({
      source_id: group.source_id,
      geo_cell_id: group.geo_cell_id,
      operation_type: group.operation_type,
      property_group: group.property_group,
      frequency_level: getHighestFrequency(group.demands),
      active_search_count: countSearches(group),
      active_tenant_count: countTenants(group),
      priority: calculatePriority(group)
    })

  deactivatePlansWithoutActiveDemand()
}
```

---

# 10. Scheduler

El scheduler no mira clientes. Mira `scrape_plans`.

```text
function scheduleScrapeJobs() {
  plans = getActiveScrapePlansDueToRun(now)

  for each plan in plans:
    if (hasRecentRunningJob(plan)) continue

    job = createScrapeJob(plan)
    queue.add('scrape-source', { jobId: job.id })
    updatePlanLastScheduledAt(plan)
}
```

---

# 11. Worker de scraping

```text
function runScrapeJob(jobId) {
  job = getJob(jobId)
  plan = getScrapePlan(job.scrape_plan_id)
  adapter = getAdapter(plan.source_id)

  markJobRunning(job)

  try {
    rawListings = adapter.search(plan.geo_cell_id, plan.filters)

    for each rawListing in rawListings:
      snapshot = saveSnapshot(rawListing)
      normalized = normalize(rawListing)
      listing = upsertSourceListing(normalized)
      enqueueDeduplication(listing.id)
      enqueueMatching(listing.id)

    markJobSuccess(job)
  } catch (error) {
    markJobFailed(job, error)
  }
}
```

---

# 12. Matching posterior

El scraper no sabe qué cliente verá el inmueble.

Después de capturar:

```text
function matchListing(listingId) {
  listing = getListing(listingId)
  candidateSearches = findSearchesByGeo(listing.lat, listing.lng)

  for each search in candidateSearches:
    if (!matchesSearch(listing, search)) continue
    if (!tenantHasRemainingQuota(search.tenant_id)) continue

    upsertTenantListingMatch(search, listing)
  }
}
```

---

# 13. Prioridad por rentabilidad

Cada `scrape_plan` debería calcular:

```text
active_tenant_count
active_search_count
estimated_monthly_cost
estimated_monthly_revenue
profitability_score
```

Ejemplo:

```text
Murcia centro:
- 12 tenants
- coste medio
- rentable

Madrid centro:
- 1 tenant
- coste alto
- revisar pricing
```

---

# 14. Desactivación automática

Cuando un tenant cancela o desactiva una búsqueda:

```text
1. Desactivar tenant_search.
2. Desactivar scrape_demands asociadas.
3. Recalcular scrape_plans.
4. Si un scrape_plan queda sin demanda, marcar inactive.
5. Scheduler deja de generar jobs.
```

---

# 15. Control antiabuso

Evitar:

- radios enormes;
- demasiadas fuentes;
- frecuencia alta en planes bajos;
- búsquedas duplicadas por el mismo tenant;
- zonas de alto volumen sin plan adecuado;
- exportaciones masivas sin control.

Medidas:

- límites de plan;
- créditos de cobertura;
- límite mensual de nuevos listings;
- límites por fuente;
- rate limits;
- revisión manual de zonas premium.

---

# 16. Evolución del sistema

## MVP

```text
municipio/barrio + radio
agrupación simple
scheduler fijo
matching básico
```

## Versión 2

```text
geo_cells
prioridad por zona
frecuencia por plan
métricas por scrape_plan
```

## Versión 3

```text
H3/geohash
coverage credits
coste/rentabilidad por zona
frecuencia dinámica
colas por prioridad
```

---

# 17. Regla final

El sistema debe escalar por cobertura agregada, no por scrapers individuales de cliente.

```text
Correcto: cobertura por zona con suscriptores.
Incorrecto: scraper por cliente.
```
