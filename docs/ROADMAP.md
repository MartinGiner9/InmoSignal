# Roadmap por fases — Radar Inmobiliario SaaS

## Objetivo del roadmap

Construir el producto de forma progresiva, evitando el error de intentar crear desde el inicio un CRM inmobiliario completo con IA, llamadas, WhatsApp y scraping avanzado.

La prioridad es validar la parte que más valor puede aportar: **captación temprana de propietarios particulares y gestión comercial básica de oportunidades**.

---

# Fase 0 — Diseño funcional y validación comercial

## Objetivo

Validar que las inmobiliarias realmente pagarían por el producto antes de invertir demasiado desarrollo.

## Entregables

- Documento de propuesta de valor.
- Mockups simples de pantalla.
- Definición de planes iniciales.
- Lista de 10-20 inmobiliarias entrevistadas.
- Feedback real de clientes potenciales.
- Definición del MVP mínimo vendible.

## Funcionalidades a definir

- Alta de inmobiliaria.
- Búsqueda por zona.
- Listado de inmuebles detectados.
- Pipeline comercial básico.
- Asignación a agente.
- Alertas.
- Scoring simple.

## Lo que NO se implementa todavía

- WhatsApp automático.
- Llamadas IA.
- CRM completo.
- Facturación compleja.
- Multi-oficina avanzada.
- Integraciones externas.

## Criterio de éxito

Al menos 3 inmobiliarias deben aceptar probar el MVP o pagar un piloto.

Si nadie está dispuesto a pagar o probar en serio, hay que replantear el producto.

---

# Fase 1 — Base SaaS multi-tenant

## Objetivo

Crear la base técnica del SaaS: autenticación, tenants, usuarios, roles, límites y estructura modular.

## Módulos

### Autenticación

- Registro/login.
- Recuperación de contraseña.
- Sesiones seguras.
- Refresh token.
- Protección de rutas.

### Multi-tenant

- `tenants`.
- `users`.
- `tenant_users`.
- roles básicos.
- separación de datos por tenant.

### Roles iniciales

- Owner.
- Admin.
- Manager.
- Agent.
- Viewer.

### Planes y límites

- plan asignado al tenant;
- máximo de usuarios;
- máximo de búsquedas activas;
- frecuencia permitida;
- límite mensual de inmuebles detectados.

## Implementación recomendada

### Frontend

- Next.js.
- Tailwind.
- shadcn/ui.
- Formularios con React Hook Form + Zod.

### Backend

- NestJS.
- Módulos separados.
- Prisma.
- PostgreSQL.
- JWT/cookies seguras.

### Base de datos mínima

```text
tenants
users
tenant_users
roles
plans
subscription_limits
audit_logs
```

## Criterio de éxito

Una inmobiliaria puede acceder a su panel, invitar usuarios y tener límites de plan aplicados.

---

# Fase 2 — Búsquedas de captación

## Objetivo

Permitir que una inmobiliaria configure las zonas e inmuebles que quiere monitorizar.

## Funcionalidades

### Crear búsqueda

Campos:

- nombre;
- zona;
- radio;
- municipio/provincia;
- operación: venta/alquiler;
- tipo de inmueble;
- precio mínimo;
- precio máximo;
- fuentes activas;
- frecuencia;
- agente asignado;
- activa/inactiva.

### Listar búsquedas

- estado;
- zona;
- resultados recientes;
- última actualización;
- frecuencia;
- consumo del plan.

### Editar búsqueda

Al editar una búsqueda, se debe recalcular la demanda técnica de scraping.

### Desactivar búsqueda

Al desactivar una búsqueda, el sistema debe eliminar su demanda activa y recalcular scrape plans.

## Implementación

Crear módulos:

```text
searches
geo
plans
```

Tablas:

```text
tenant_searches
tenant_search_sources
tenant_search_filters
geo_areas
geo_cells
scrape_demands
```

## Reglas importantes

- No permitir radios ilimitados.
- No permitir frecuencias superiores al plan.
- No permitir más búsquedas que las contratadas.
- No crear scrape jobs directamente desde la búsqueda.
- La búsqueda solo registra demanda.

## Criterio de éxito

El cliente puede crear búsquedas comerciales y el sistema registra automáticamente las demandas técnicas necesarias.

---

# Fase 3 — Scraping planner y scheduler

## Objetivo

Automatizar la generación de trabajos técnicos de scraping agrupando búsquedas solapadas de distintos clientes.

## Componentes

### Scraping Planner

Responsabilidades:

- leer `tenant_searches` activas;
- calcular cobertura geográfica;
- crear `scrape_demands`;
- agrupar demandas por fuente/zona/operación/tipo/frecuencia;
- crear o actualizar `scrape_plans`;
- desactivar planes sin demanda.

### Scheduler

Responsabilidades:

- revisar `scrape_plans` activos;
- calcular si toca ejecutar scraping;
- crear `scrape_jobs`;
- enviar jobs a la cola.

### Cola de trabajos

- Redis.
- BullMQ.
- Workers separados.

## Agrupación inicial recomendada

Para MVP:

```text
municipio/barrio + radio + fuente + operación + tipo general
```

Para futuro:

```text
geohash/H3/grid propio + densidad + frecuencia + fuente
```

## Ejemplo

Tres inmobiliarias piden Murcia centro.

El sistema no crea tres scrapers.

Crea un único plan:

```text
Idealista / Murcia centro / venta / viviendas / cada 2-4h
```

Luego los resultados se reparten por matching.

## Tablas

```text
scrape_demands
scrape_plans
scrape_jobs
scrape_runs
scrape_errors
```

## Criterio de éxito

Varias inmobiliarias pueden tener búsquedas similares y el sistema ejecuta un único scraping compartido por zona/fuente.

---

# Fase 4 — Captura, normalización y deduplicación

## Objetivo

Capturar inmuebles desde fuentes, normalizarlos y evitar duplicados.

## Componentes

### Source adapters

Cada fuente debe tener su propio adaptador.

Ejemplo:

```text
IdealistaAdapter
FotocasaAdapter
HabitacliaAdapter
MilanunciosAdapter
CustomSourceAdapter
```

Cada adaptador debe implementar una interfaz común:

```text
search(area, filters)
parseListing(raw)
extractDetails(url)
normalize(rawListing)
```

### Normalizador

Convierte datos heterogéneos a un formato común:

- título;
- descripción;
- precio;
- metros;
- habitaciones;
- baños;
- ubicación;
- lat/lng si existe;
- tipo de operación;
- tipo de inmueble;
- fuente;
- URL;
- fecha detectada;
- posible particular/profesional.

### Deduplicador

Debe detectar anuncios repetidos.

Criterios posibles:

- misma URL;
- mismo external_id;
- misma dirección aproximada;
- mismo precio;
- mismas fotos;
- título parecido;
- metros/habitaciones similares;
- hash normalizado.

## Tablas

```text
sources
source_listings
listing_snapshots
normalized_listings
listing_duplicates
```

## Reglas

- Guardar siempre el dato bruto original.
- Guardar snapshots para auditoría y depuración.
- No sobrescribir sin histórico.
- Registrar cambios de precio.
- Registrar cuándo se detectó por primera vez.

## Criterio de éxito

El sistema puede capturar listados, normalizarlos y saber si son nuevos, repetidos o actualizaciones.

---

# Fase 5 — Matching con inmobiliarias

## Objetivo

Asignar los inmuebles globales a cada inmobiliaria según sus búsquedas activas.

## Flujo

```text
1. Worker captura listing global.
2. Normalizador limpia los datos.
3. Deduplicador detecta si es nuevo o actualizado.
4. Matching engine busca tenant_searches compatibles.
5. Crea tenant_listing_matches.
6. Si cumple prioridad, crea opportunity o alerta.
```

## Filtros de matching

- zona/radio;
- precio;
- tipo de inmueble;
- operación;
- fuente;
- antigüedad;
- posible particular;
- palabras clave;
- plan del cliente;
- límite mensual.

## Tabla principal

```text
tenant_listing_matches
```

Campos:

```text
id
tenant_id
tenant_search_id
source_listing_id
match_score
matched_at
status
assigned_to_user_id
hidden
reason
```

## Estados iniciales

```text
new
reviewed
converted_to_opportunity
dismissed
duplicate
out_of_plan_limit
```

## Criterio de éxito

Una inmobiliaria ve únicamente los inmuebles que encajan con sus búsquedas y no ve datos de otros tenants.

---

# Fase 6 — Pipeline comercial de oportunidades

## Objetivo

Convertir matches interesantes en oportunidades comerciales gestionables por agentes.

## Funcionalidades

### Oportunidades

- crear oportunidad desde match;
- asignar agente;
- cambiar estado;
- añadir notas;
- programar tarea;
- registrar llamada;
- registrar resultado;
- marcar como no contactar;
- marcar como captado/perdido.

### Estados recomendados

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

### Actividades

Cada acción debe generar actividad:

- nota;
- llamada;
- WhatsApp;
- email;
- cambio de estado;
- tarea;
- asignación;
- comentario interno.

## Tablas

```text
opportunities
activities
tasks
calls
messages
consent_records
```

## Criterio de éxito

Un equipo comercial puede trabajar oportunidades de forma ordenada sin depender de hojas Excel o notas sueltas.

---

# Fase 7 — Alertas y scoring

## Objetivo

Priorizar oportunidades y avisar rápido a los agentes adecuados.

## Scoring inicial

Factores:

- antigüedad del anuncio;
- zona demandada;
- precio frente a rango objetivo;
- posible particular;
- calidad de datos;
- cambios de precio;
- densidad de competencia;
- coincidencia con filtros del cliente;
- histórico de captaciones similares.

## Tipos de alerta

- email;
- notificación interna;
- Telegram/Slack opcional;
- WhatsApp interno futuro.

## Reglas

- No alertar todo.
- Alertar solo matches nuevos o de alta prioridad.
- Permitir digest diario/semanal.
- Permitir alertas inmediatas en planes superiores.

## Tablas

```text
opportunity_scores
notifications
notification_preferences
```

## Criterio de éxito

Los agentes reciben menos ruido y más oportunidades útiles.

---

# Fase 8 — IA asistida

## Objetivo

Añadir IA como ayuda comercial, no como piloto automático.

## Funcionalidades

- resumen del inmueble;
- explicación del score;
- guion de llamada;
- mensaje editable para primer contacto;
- objeciones y respuestas;
- recomendación de siguiente acción;
- resumen de llamada;
- clasificación de interés.

## Implementación

Crear módulo:

```text
ai
```

Tablas:

```text
ai_prompts
ai_prompt_versions
ai_outputs
ai_reviews
```

Cada salida debe guardar:

- modelo;
- versión de prompt;
- input snapshot;
- output;
- usuario que revisó;
- estado de aprobación.

## Reglas

- La IA no debe contactar automáticamente.
- La IA no debe inventar datos de mercado.
- Todo mensaje generado debe ser editable.
- Acciones sensibles requieren aprobación humana.

## Criterio de éxito

El equipo comercial ahorra tiempo preparando contacto y seguimiento, sin perder control humano.

---

# Fase 9 — Comunicaciones: WhatsApp, llamadas y email

## Objetivo

Integrar comunicaciones de forma segura, auditable y legalmente prudente.

## WhatsApp

Uso recomendado inicial:

- leads entrantes;
- recordatorios;
- visitas;
- conversaciones iniciadas por el usuario;
- plantillas aprobadas;
- seguimiento con consentimiento.

No recomendado:

- WhatsApp frío automático a propietarios scrapeados.

## Llamadas

Primera versión:

- click-to-call;
- registro de llamada;
- resultado;
- notas;
- próxima tarea.

Versión avanzada:

- transcripción;
- resumen IA;
- clasificación;
- llamadas inbound asistidas.

## Email

- plantillas;
- seguimiento;
- notificaciones internas;
- invitaciones.

## Tablas

```text
messages
message_templates
calls
call_recordings
call_transcripts
communication_consents
opt_out_records
```

## Criterio de éxito

Las comunicaciones quedan registradas dentro de la oportunidad y respetan límites legales y de consentimiento.

---

# Fase 10 — CRM inmobiliario ligero

## Objetivo

Evolucionar desde radar de captación a CRM ligero.

## Funcionalidades

- contactos;
- propietarios;
- compradores;
- inmuebles captados;
- visitas;
- calendario;
- documentos;
- tareas;
- embudo comercial;
- reportes por agente;
- reportes por zona;
- exportación.

## Entidades

```text
contacts
properties
owners
buyers
visits
documents
pipelines
pipeline_stages
```

## Criterio de éxito

Una inmobiliaria puede gestionar no solo oportunidades de captación, sino también parte importante de su proceso comercial.

---

# Fase 11 — Facturación, planes e integraciones

## Objetivo

Convertir el producto en SaaS escalable comercialmente.

## Funcionalidades

- Stripe billing;
- planes;
- add-ons;
- límites automáticos;
- upgrade/downgrade;
- facturas;
- trial;
- cupones;
- integraciones con CRM externo;
- API pública futura.

## Planes

- Starter.
- Pro.
- Growth.
- Agency/Enterprise.

## Add-ons

- usuario adicional;
- búsqueda adicional;
- cobertura extra;
- frecuencia premium;
- IA avanzada;
- comunicaciones;
- integraciones.

## Criterio de éxito

El sistema puede cobrar, limitar uso y escalar clientes sin intervención manual constante.

---

# Fase 12 — Optimización avanzada y escalado

## Objetivo

Mejorar rendimiento, coste, precisión y escalabilidad.

## Mejoras técnicas

- grid geográfico avanzado;
- créditos de cobertura;
- priorización por rentabilidad de zona;
- análisis de coste por scrape_area;
- adaptación dinámica de frecuencia;
- caching;
- colas separadas por prioridad;
- control antiabuso;
- monitorización avanzada;
- dashboards internos de operación.

## Métricas internas

- coste por zona;
- ingresos asociados por zona;
- listings por ejecución;
- errores por fuente;
- tasa de duplicados;
- tasa de conversión a oportunidad;
- tasa de captación;
- tiempo medio hasta contacto;
- uso por tenant;
- margen por cliente.

## Criterio de éxito

El producto escala sin multiplicar linealmente costes por cada nuevo cliente.

---

# Orden recomendado de construcción

```text
1. Multi-tenant base
2. Búsquedas del cliente
3. Scraping planner simple
4. Scraper de una fuente inicial
5. Normalización/deduplicación
6. Matching
7. Pipeline comercial
8. Alertas
9. Scoring básico
10. IA asistida
11. Comunicaciones
12. CRM ligero
13. Billing avanzado
14. Optimización geográfica avanzada
```

---

# Regla de decisión

Antes de construir cada fase, preguntar:

```text
¿Esto ayuda a captar más inmuebles, ahorrar tiempo comercial o aumentar ingresos del cliente?
```

Si la respuesta es no, no entra en el MVP.
