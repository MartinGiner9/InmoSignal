# Modelo de datos

## Multi-tenant

`Tenant`, `User` y `TenantUser` separan organizaciones, usuarios y roles. Las entidades privadas usan `tenantId` donde aplica, sin bases separadas por tenant.

## Captacion

`TenantSearch` representa la intencion comercial del cliente. `GeoArea` y `GeoCell` preparan agrupacion geografica.

## Scraping global

`ScrapeDemand` es la traduccion tecnica de una busqueda. `ScrapePlan` agrupa demandas compatibles. `ScrapeRun` registra ejecuciones.

## Listings

`Source` identifica el portal. `SourceListing` guarda el registro bruto global. `NormalizedListing` contiene la version normalizada.

## Matching y CRM

`TenantListingMatch` decide visibilidad privada por tenant. `Opportunity` es el centro del CRM. `Activity` registra acciones comerciales.

## Trazabilidad y billing

`SubscriptionPlan`, `SubscriptionLimit` y `AuditLog` dejan la base preparada para limites, compliance y auditoria futura.
