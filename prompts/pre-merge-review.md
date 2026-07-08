# Prompt — Revisión pre-merge

Revisa los cambios actuales del repo InmoSignal como reviewer senior.

No seas complaciente. Busca problemas reales.

## Debes revisar

- Compilación.
- Prisma schema.
- Relaciones multi-tenant.
- Respeto a la regla: scraper no conoce tenantId.
- Separación API / workers / scraping-core.
- Tests.
- Seguridad básica.
- Riesgo de deuda técnica.
- Consistencia de nombres.
- ESM/CommonJS.
- Scripts y CI.

## Formato de respuesta

```txt
Veredicto: APPROVE / APPROVE_WITH_CHANGES / REQUEST_CHANGES

Bloqueos:
- ...

Problemas importantes:
- ...

Mejoras recomendadas:
- ...

Qué validaría antes de merge:
- ...
```

## Criterios para bloquear

Bloquea si:

- rompe build;
- rompe Prisma validate;
- acopla scraper con tenant;
- mete scraping real sin permiso;
- mezcla responsabilidades graves;
- filtra datos entre tenants;
- elimina trazabilidad;
- mete secretos;
- introduce automatización comercial peligrosa.
