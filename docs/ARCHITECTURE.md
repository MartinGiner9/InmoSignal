# Arquitectura

## Apps

- `apps/web`: dashboard Next.js con rutas iniciales.
- `apps/api`: API NestJS modular con endpoints placeholder.
- `apps/workers`: workers Node.js para colas BullMQ.

## Packages

- `packages/shared`: tipos, constantes y schemas Zod.
- `packages/config`: validacion tipada de entorno.
- `packages/database`: Prisma schema y cliente.
- `packages/scraping-core`: interfaces y adapters stub.
- `packages/eslint-config`: configuracion compartida de lint.
- `packages/tsconfig`: configuracion TypeScript compartida.

## Flujo previsto

1. Un tenant crea `TenantSearch`.
2. La API la convierte en `ScrapeDemand` tecnica.
3. Demandas compatibles se agrupan en `ScrapePlan`.
4. Workers ejecutan `ScrapeRun` globales por fuente/zona/filtro.
5. El sistema guarda `SourceListing` y `NormalizedListing` globales.
6. Matching crea `TenantListingMatch` privado por tenant.
7. El tenant trabaja `Opportunity` y `Activity` en el CRM.
