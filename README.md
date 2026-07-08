# InmoSignal

Monorepo inicial para un SaaS B2B inmobiliario. La base prepara dashboard, API, workers, Prisma, PostgreSQL, Redis y un nucleo de scraping con adapters stub.

## Requisitos

- Node.js 22+
- pnpm 11+
- Docker

## Arranque local

Para desarrollo normal no hace falta Redis ni workers:

```bash
pnpm install
pnpm infra
pnpm db:generate
pnpm dev
```

URLs:

- Web: `http://localhost:3000`
- API: `http://localhost:3001`

Para levantar tambien Redis y workers:

```bash
pnpm infra:all
pnpm dev:all
```

Para parar la infraestructura:

```bash
pnpm infra:down
```

Puedes crear `.env` desde `.env.example` si quieres cambiar puertos o credenciales, pero los defaults locales funcionan sin copiarlo.

## Scripts

- `pnpm dev`: levanta web y API.
- `pnpm dev:all`: levanta web, API y workers.
- `pnpm dev:workers`: levanta solo workers.
- `pnpm infra`: levanta PostgreSQL.
- `pnpm infra:all`: levanta PostgreSQL y Redis.
- `pnpm infra:down`: para Docker Compose.
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
