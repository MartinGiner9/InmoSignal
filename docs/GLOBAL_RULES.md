# Reglas globales del proyecto InmoSignal

Estas reglas deben aplicarse a cualquier agente que trabaje sobre el repo.

## Producto

InmoSignal es un SaaS B2B para inmobiliarias. Su primera propuesta de valor no es “CRM con IA”, sino:

> Detectar oportunidades de captación inmobiliaria antes, agrupar búsquedas de forma eficiente y permitir seguimiento comercial ordenado.

## Arquitectura

- Monorepo con `pnpm` + Turborepo.
- Frontend: Next.js.
- API: NestJS.
- Workers: BullMQ + Redis.
- Base de datos: PostgreSQL + Prisma.
- Scraping: Crawlee + Playwright + Cheerio.
- Validación compartida: Zod.
- Multi-tenant desde el inicio.
- No microservicios al principio.
- No scraper por tenant.

## Regla crítica de scraping

MAL:

```txt
Tenant A -> scraper Murcia
Tenant B -> scraper Murcia
Tenant C -> scraper Murcia
```

BIEN:

```txt
TenantSearch A
TenantSearch B
TenantSearch C
      ↓
ScrapeDemand
      ↓
ScrapePlan global Murcia
      ↓
ScrapeRun
      ↓
Listings globales
      ↓
TenantListingMatch privado
```

## Prohibido en fases iniciales

- Scraping real agresivo contra portales.
- Automatizar WhatsApp frío.
- Automatizar llamadas frías.
- Guardar o explotar datos personales sin análisis legal.
- Meter IA en todos los flujos sin necesidad.
- Construir CRM completo antes de validar captación.
- Hacer microservicios prematuros.
- Crear scripts sueltos sin trazabilidad.
- Acoplar scraper con tenant.
- Meter lógica falsa compleja para “parecer avanzado”.

## Calidad mínima

Todo cambio relevante debe poder pasar:

```bash
pnpm install --frozen-lockfile
pnpm db:generate
pnpm --filter @repo/database prisma validate
pnpm lint
pnpm test
pnpm build
```

## Convenciones

- Prisma usa enums en MAYÚSCULAS.
- DTO/API puede usar minúsculas.
- Si hay conversión, debe estar centralizada.
- `AdapterNormalizedListing` es salida de adapter.
- `NormalizedListing` es modelo interno/global persistido.
- El mapper entre ambos debe ser explícito.
