# InmoSignal

Monorepo inicial para un SaaS B2B inmobiliario. La base prepara dashboard, API, workers, Prisma, PostgreSQL, Redis y un nucleo de scraping con adapters stub.

## Requisitos

- Node.js 22+
- pnpm 11+
- Docker

## Arranque local

```bash
cp .env.example .env
pnpm install
docker compose up -d
pnpm db:generate
pnpm dev
```

## Scripts

- `pnpm dev`: apps en modo desarrollo con Turborepo.
- `pnpm build`: compila apps y packages.
- `pnpm lint`: ejecuta ESLint.
- `pnpm test`: ejecuta Vitest donde aplique.
- `pnpm db:migrate`: crea/aplica migraciones Prisma.
- `pnpm db:studio`: abre Prisma Studio.

## Validacion

```bash
pnpm install
pnpm build
pnpm lint
pnpm test
pnpm db:generate
pnpm --filter @repo/database prisma validate
```

## Estructura

```txt
apps/web       Next.js dashboard
apps/api       NestJS API modular
apps/workers   BullMQ workers
packages/*     config, database, shared schemas, scraping core, lint, tsconfig
docs/*         arquitectura y roadmap
```

No hay scraping real ni autenticacion completa todavia.
