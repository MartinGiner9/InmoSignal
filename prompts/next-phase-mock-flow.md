# Prompt — Implementar flujo mock completo

Quiero implementar la siguiente fase de InmoSignal: flujo completo con adapter mock, sin scraping real.

## Objetivo

Implementar este flujo:

```txt
TenantSearch
  -> ScrapeDemand
  -> ScrapePlan
  -> ScrapeRun
  -> mockAdapter
  -> SourceListing
  -> NormalizedListing
  -> TenantListingMatch
```

## Reglas

- No usar portales reales.
- No hacer scraping real.
- No acoplar scraper con tenant.
- El scraper solo trabaja con ScrapePlan.
- La privacidad se resuelve con TenantListingMatch.
- Usar Prisma.
- Usar servicios NestJS/Workers bien separados.
- Añadir tests.

## Tareas

1. Crear endpoint para crear `TenantSearch`.
2. Al crear búsqueda:
   - validar límites mínimos;
   - crear `TenantSearchSource`;
   - crear `ScrapeDemand`;
   - recalcular o crear `ScrapePlan`.
3. Implementar servicio de planner:
   - agrupa por sourceId, geoCellId, operation, propertyType, frequency;
   - conecta múltiples ScrapeDemand a un ScrapePlan mediante ScrapePlanDemand;
   - no duplica planes existentes.
4. Implementar scheduler/producer básico:
   - puede encolar manualmente un ScrapePlan por ahora;
   - no necesita cron completo todavía.
5. Implementar processor `scrape-plan` con `mockAdapter`:
   - crea `ScrapeRun`;
   - ejecuta adapter mock;
   - guarda `SourceListing`;
   - crea/actualiza `NormalizedListing`;
   - marca métricas en `ScrapeRun`.
6. Implementar processor o servicio de matching:
   - compara listings con `TenantSearch`;
   - crea `TenantListingMatch`;
   - evita duplicados.
7. Añadir tests:
   - dos tenants misma zona generan un solo ScrapePlan;
   - una ejecución mock crea listings globales;
   - cada tenant solo ve sus matches;
   - no se crean matches duplicados.

## Criterios de aceptación

Deben pasar:

```bash
pnpm db:generate
pnpm --filter @repo/database prisma validate
pnpm lint
pnpm test
pnpm build
```

No implementar:

- autenticación real;
- scraping real;
- WhatsApp;
- llamadas;
- IA;
- CRM completo.
