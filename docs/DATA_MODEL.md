# Modelo de datos inicial

## 1. Objetivo

Definir un modelo de datos preparado para:

- SaaS multi-tenant;
- búsquedas por inmobiliaria;
- scraping global;
- matching privado;
- pipeline comercial;
- pricing por límites;
- evolución hacia CRM.

---

# 2. Entidades principales

```text
Tenant
User
TenantUser
Plan
SubscriptionLimit
TenantSearch
GeoArea / GeoCell
ScrapeDemand
ScrapePlan
ScrapeJob
SourceListing
NormalizedListing
TenantListingMatch
Opportunity
Activity
Task
Message
Call
ConsentRecord
AuditLog
```

---

# 3. Multi-tenant

## tenants

Representa una inmobiliaria.

```text
id
name
slug
status
created_at
updated_at
```

## users

Usuario global del sistema.

```text
id
email
password_hash
name
status
created_at
updated_at
```

## tenant_users

Relación usuario-inmobiliaria.

```text
id
tenant_id
user_id
role
status
created_at
updated_at
```

Roles recomendados:

```text
owner
admin
manager
agent
viewer
```

---

# 4. Planes y límites

## plans

```text
id
name
code
price_monthly
status
created_at
updated_at
```

## subscription_limits

```text
id
tenant_id
plan_id
max_users
max_active_searches
max_geo_coverage_credits
max_sources
min_refresh_interval_minutes
max_monthly_new_listings
max_alerts_per_day
ai_credits_monthly
whatsapp_credits_monthly
created_at
updated_at
```

## tenant_usage

Opcional pero recomendable.

```text
id
tenant_id
period_start
period_end
active_users
active_searches
new_listings_count
alerts_sent
ai_credits_used
whatsapp_credits_used
created_at
updated_at
```

---

# 5. Búsquedas comerciales

## tenant_searches

Lo que una inmobiliaria quiere monitorizar.

```text
id
tenant_id
name
operation_type
property_types
price_min
price_max
center_lat
center_lng
radius_km
city
province
frequency_level
assigned_user_id
status
created_at
updated_at
```

`frequency_level` puede ser:

```text
low      -> cada 12/24h
medium   -> cada 4/6h
high     -> cada 1/2h
premium  -> prioridad alta
```

## tenant_search_sources

```text
id
tenant_search_id
source_id
active
created_at
```

## tenant_search_filters

Para filtros adicionales.

```text
id
tenant_search_id
filter_key
filter_value
created_at
```

Ejemplos:

```text
only_private_owner = true
min_rooms = 2
max_m2 = 120
keywords = "reformado, oportunidad"
```

---

# 6. Geografía

## geo_areas

Zonas de negocio visibles para el usuario.

```text
id
name
area_type
city
province
country
center_lat
center_lng
radius_km
status
created_at
updated_at
```

## geo_cells

Zonas técnicas reutilizables.

```text
id
cell_code
area_type
city
province
center_lat
center_lng
radius_km
polygon
estimated_density_level
status
created_at
updated_at
```

Para MVP se puede usar municipio/barrio + radio.

Para futuro se puede evolucionar a geohash, H3 o grid propio.

---

# 7. Scraping planner

## scrape_demands

Registra que una búsqueda de cliente necesita cobertura técnica.

```text
id
tenant_search_id
tenant_id
geo_cell_id
source_id
operation_type
property_group
frequency_level
active
created_at
updated_at
```

## scrape_plans

Plan técnico agregado y compartido.

```text
id
source_id
geo_cell_id
operation_type
property_group
frequency_level
active_search_count
active_tenant_count
priority
last_scheduled_at
next_run_at
status
created_at
updated_at
```

## scrape_jobs

Ejecución programada.

```text
id
scrape_plan_id
status
scheduled_at
started_at
finished_at
attempts
error_message
created_at
updated_at
```

Estados:

```text
pending
running
success
failed
cancelled
```

## scrape_runs

Resultado de una ejecución.

```text
id
scrape_job_id
source_id
geo_cell_id
items_found
items_new
items_updated
items_duplicated
duration_ms
error_count
created_at
```

---

# 8. Fuentes y listings globales

## sources

```text
id
name
code
base_url
status
created_at
updated_at
```

## source_listings

Dato global capturado.

```text
id
source_id
external_id
url
title
description
price
currency
operation_type
property_type
address_text
city
province
lat
lng
rooms
bathrooms
area_m2
seller_type
first_detected_at
last_seen_at
published_at
hash
status
created_at
updated_at
```

`seller_type` puede ser:

```text
private
professional
unknown
```

## listing_snapshots

Histórico bruto.

```text
id
source_listing_id
raw_payload
html_snapshot_url
captured_at
```

## normalized_listings

Versión limpia/enriquecida.

```text
id
source_listing_id
normalized_title
normalized_address
normalized_price
normalized_property_type
normalized_operation_type
quality_score
created_at
updated_at
```

## listing_duplicates

```text
id
source_listing_id
duplicate_of_listing_id
confidence
reason
created_at
```

---

# 9. Matches por inmobiliaria

## tenant_listing_matches

Resultado privado para cada tenant.

```text
id
tenant_id
tenant_search_id
source_listing_id
match_score
match_reasons
status
assigned_to_user_id
matched_at
created_at
updated_at
```

Estados:

```text
new
reviewed
converted_to_opportunity
dismissed
duplicate
out_of_plan_limit
```

---

# 10. Oportunidades comerciales

## opportunities

```text
id
tenant_id
tenant_listing_match_id
source_listing_id
title
status
priority
assigned_to_user_id
contact_name
contact_phone
contact_email
next_action_at
created_at
updated_at
```

Estados:

```text
new
reviewing
contact_pending
contacted
no_answer
interested
not_interested
visit_scheduled
captured
lost
do_not_contact
```

## activities

```text
id
tenant_id
opportunity_id
user_id
activity_type
content
metadata
created_at
```

Tipos:

```text
note
call
message
email
status_change
task_created
task_completed
assignment
system_event
```

## tasks

```text
id
tenant_id
opportunity_id
assigned_to_user_id
title
description
due_at
status
created_at
updated_at
```

Estados:

```text
pending
completed
cancelled
overdue
```

---

# 11. Comunicaciones

## messages

```text
id
tenant_id
opportunity_id
channel
direction
sender_user_id
recipient
content
status
external_id
created_at
updated_at
```

Canales:

```text
whatsapp
email
sms
internal
```

## calls

```text
id
tenant_id
opportunity_id
user_id
phone_number
direction
status
duration_seconds
recording_url
transcript
summary
created_at
updated_at
```

## consent_records

```text
id
tenant_id
contact_identifier
channel
consent_status
source
legal_basis
obtained_at
revoked_at
notes
created_at
updated_at
```

Estados:

```text
unknown
consented
revoked
opposed
do_not_contact
```

---

# 12. IA

## ai_prompts

```text
id
code
name
description
status
created_at
updated_at
```

## ai_prompt_versions

```text
id
prompt_id
version
prompt_template
model
status
created_at
updated_at
```

## ai_outputs

```text
id
tenant_id
entity_type
entity_id
prompt_version_id
input_snapshot
output
review_status
reviewed_by_user_id
created_at
updated_at
```

Estados:

```text
pending_review
approved
edited
rejected
```

---

# 13. Auditoría

## audit_logs

```text
id
tenant_id
user_id
action
entity_type
entity_id
before_data
after_data
ip_address
user_agent
created_at
```

Auditar siempre:

- cambios de búsqueda;
- cambios de límites;
- exportaciones;
- mensajes enviados;
- llamadas;
- cambios de estado;
- eliminación de datos;
- cambios de rol.

---

# 14. Relaciones clave

```text
Tenant 1—N TenantSearch
TenantSearch 1—N ScrapeDemand
ScrapeDemand N—1 GeoCell
ScrapeDemand N—1 Source
ScrapePlan 1—N ScrapeJob
SourceListing 1—N TenantListingMatch
TenantListingMatch 0—1 Opportunity
Opportunity 1—N Activity
Opportunity 1—N Task
Opportunity 1—N Message
Opportunity 1—N Call
```

---

# 15. Índices recomendados

```text
tenant_searches(tenant_id, status)
scrape_demands(geo_cell_id, source_id, active)
scrape_plans(source_id, geo_cell_id, operation_type, property_group, status)
source_listings(source_id, external_id)
source_listings(hash)
source_listings(city, province)
source_listings(lat, lng)
tenant_listing_matches(tenant_id, status)
tenant_listing_matches(tenant_search_id, source_listing_id)
opportunities(tenant_id, status)
activities(tenant_id, opportunity_id)
audit_logs(tenant_id, created_at)
```

---

# 16. Regla crítica de aislamiento

Ninguna query de datos privados debe ejecutarse sin `tenant_id`.

Los datos globales de scraping pueden estar compartidos, pero el acceso del cliente siempre debe pasar por `tenant_listing_matches`, `opportunities` u otras entidades privadas del tenant.
