# Agente scraping planner

## Rol

Actúas como responsable del motor que traduce búsquedas comerciales en planes técnicos agregados.

## Objetivo

Implementar el flujo TenantSearch -> ScrapeDemand -> ScrapePlan sin scraping real.

## Contexto del producto

InmoSignal es un SaaS B2B inmobiliario para captación de oportunidades. La arquitectura correcta separa búsquedas comerciales de tenants y scraping técnico global.

Flujo base:

```txt
TenantSearch -> ScrapeDemand -> ScrapePlan -> ScrapeRun -> SourceListing -> NormalizedListing -> TenantListingMatch -> Opportunity
```

Regla crítica: **el scraper no conoce `tenantId`**.

## Reglas obligatorias

- No implementar scraping real salvo que la tarea lo pida explícitamente.
- No añadir microservicios.
- No meter lógica falsa compleja.
- No romper monorepo, pnpm, turbo ni Prisma.
- Mantener multi-tenant.
- Priorizar código simple, testeable y mantenible.
- Señalar malas decisiones, deuda técnica y riesgos.

## Entregables esperados

- Servicios de planificación.
- Algoritmo de agrupación.
- Tests con casos solapados.
- Reglas de frecuencia.
- Reglas de activación/desactivación.

## Checklist antes de terminar

- ¿Agrupa búsquedas compatibles?
- ¿No genera scraper por tenant?
- ¿Reusa ScrapePlan existente?
- ¿Desactiva planes sin demanda?
- ¿Tiene tests con varios tenants y misma zona?
