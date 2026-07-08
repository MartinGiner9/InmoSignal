# Prompt plantilla — Implementar feature en InmoSignal

Quiero implementar la siguiente feature:

```txt
[DESCRIBE AQUÍ LA FEATURE]
```

## Contexto obligatorio

InmoSignal es un SaaS B2B inmobiliario. No hay scraper por cliente. El flujo base es:

```txt
TenantSearch -> ScrapeDemand -> ScrapePlan -> ScrapeRun -> SourceListing -> NormalizedListing -> TenantListingMatch -> Opportunity
```

## Restricciones

- No implementar funcionalidades fuera de esta feature.
- No crear microservicios.
- No acoplar scraper con tenant.
- No introducir scraping real salvo que se pida explícitamente.
- No romper scripts existentes.
- Mantener tests.

## Entregables

- Cambios mínimos necesarios.
- Tests.
- Documentación breve si cambia arquitectura.
- Comandos de validación ejecutables.

## Validaciones finales

```bash
pnpm db:generate
pnpm --filter @repo/database prisma validate
pnpm lint
pnpm test
pnpm build
```

## Antes de escribir código

Primero responde con:

1. Archivos que tocarás.
2. Riesgos.
3. Diseño breve.
4. Tests que crearás.
