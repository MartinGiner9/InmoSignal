# Scraping planner

## Separacion obligatoria

- `tenant_search`: necesidad comercial privada de una inmobiliaria.
- `scrape_demand`: demanda tecnica derivada, sin detalles comerciales del tenant.
- `scrape_plan`: agrupacion global de demandas compatibles por zona, operacion, tipo y precio.
- `scrape_job/run`: ejecucion concreta del plan en workers.
- `source_listing`: listing bruto global por fuente.
- `tenant_listing_match`: resultado privado que habilita visibilidad para un tenant.

## Regla central

El scraper nunca recibe `tenantId` ni ejecuta una busqueda por cliente. Solo procesa planes globales. La privacidad vive despues, en matching y oportunidades.

## Estado actual

`packages/scraping-core` solo expone interfaces, adapters stub y un adapter mock. No hay llamadas reales a portales.
