# Radar Inmobiliario SaaS — README del proyecto

## 1. Resumen del proyecto

Este proyecto consiste en construir un SaaS B2B para inmobiliarias orientado inicialmente a la **captación temprana de inmuebles publicados por particulares** y a la **gestión comercial de esas oportunidades**.

La idea principal no es crear desde el día uno un CRM inmobiliario completo, sino empezar por el punto de mayor valor económico para una inmobiliaria: **detectar oportunidades antes que la competencia, priorizarlas y facilitar el seguimiento comercial**.

El producto debe evolucionar de forma natural hacia un CRM inmobiliario ligero y, más adelante, hacia una plataforma completa con automatización de WhatsApp, llamadas, visitas, agenda, documentos, IA y analítica.

---

## 2. Propuesta de valor

### Problema

Las inmobiliarias pierden mucho tiempo revisando portales, anuncios y fuentes para detectar propietarios particulares que han publicado una vivienda. Además, cuando detectan una oportunidad, muchas veces el seguimiento comercial es desordenado: notas sueltas, llamadas sin registrar, contactos duplicados y falta de priorización.

### Solución

Un sistema que:

1. Monitoriza zonas configuradas por cada inmobiliaria.
2. Agrupa búsquedas similares entre clientes para reducir coste técnico.
3. Detecta nuevos inmuebles de particulares.
4. Deduplica anuncios repetidos.
5. Asigna coincidencias a cada inmobiliaria según sus búsquedas.
6. Prioriza oportunidades mediante scoring.
7. Permite gestionar el seguimiento comercial por agente.
8. Prepara guiones, mensajes y acciones recomendadas con IA.
9. Escala hacia CRM, visitas, WhatsApp, llamadas y automatización inbound.

---

## 3. Enfoque correcto del producto

El producto debe venderse inicialmente como:

> Radar de captación inmobiliaria para detectar particulares antes, priorizar oportunidades y gestionar el seguimiento comercial.

No debe venderse inicialmente como:

> CRM completo con IA que llama y manda WhatsApps automáticamente.

Ese segundo enfoque es demasiado amplio, más difícil de vender, más arriesgado legalmente y mucho más costoso de construir.

---

## 4. Principios de diseño del producto

### 4.1. Captación antes que CRM completo

El primer MVP debe resolver una necesidad concreta y monetizable: captación de propietarios particulares.

El CRM completo se añadirá después, cuando el producto ya tenga uso real.

### 4.2. Scraping global, resultados privados

No debe existir un scraper por cliente.

El sistema debe capturar datos de forma global por fuente/zona y luego repartir resultados a cada inmobiliaria según sus búsquedas.

```text
source_listings globales
        ↓
tenant_listing_matches privados
        ↓
opportunities por inmobiliaria
```

### 4.3. Separar búsqueda comercial de trabajo técnico

Una búsqueda de cliente no es lo mismo que un job de scraping.

```text
tenant_search != scrape_job
```

La inmobiliaria configura lo que quiere. El sistema decide técnicamente qué zonas/fuentes debe monitorizar.

### 4.4. Automatización con límites

El producto debe automatizar la detección, priorización y preparación del contacto, pero no debe automatizar de forma agresiva llamadas o WhatsApps fríos a particulares sin control humano y sin base legal.

### 4.5. Pricing basado en coste real

No se debe cobrar solo por usuario. El coste real depende también de:

- búsquedas activas;
- radio/zona cubierta;
- densidad de la zona;
- frecuencia de actualización;
- fuentes activas;
- volumen de inmuebles detectados;
- uso de IA;
- uso de WhatsApp/llamadas;
- número de agentes.

---

## 5. Usuarios objetivo

### Cliente inicial

Inmobiliarias pequeñas y medianas que:

- necesitan captar propietarios;
- trabajan zonas concretas;
- tienen agentes comerciales;
- usan portales/manualidad para buscar oportunidades;
- no tienen sistemas avanzados propios;
- pagarían si el sistema les ahorra tiempo o les ayuda a captar más inmuebles.

### Cliente futuro

- Redes inmobiliarias locales.
- Inmobiliarias multi-oficina.
- Agencias especializadas en inversión.
- Equipos comerciales con varios agentes.
- Franquicias inmobiliarias.

---

## 6. Módulos principales

### 6.1. Multi-tenant

Cada inmobiliaria será un `tenant`.

Debe soportar:

- usuarios por inmobiliaria;
- roles y permisos;
- límites de plan;
- datos privados por tenant;
- auditoría de acciones;
- facturación futura.

### 6.2. Búsquedas de captación

Cada inmobiliaria podrá crear búsquedas activas con:

- zona;
- radio;
- tipo de operación: venta/alquiler;
- tipo de inmueble;
- rango de precio;
- fuentes;
- frecuencia;
- prioridad;
- agente asignado opcional.

### 6.3. Scraping planner

Motor interno que traduce búsquedas comerciales a planes técnicos de scraping.

Responsabilidades:

- calcular zonas técnicas;
- agrupar búsquedas solapadas;
- crear demandas técnicas;
- activar/desactivar scrape plans;
- controlar frecuencia;
- evitar scrapers duplicados por cliente.

### 6.4. Scraper workers

Workers independientes que capturan información por fuente/zona.

Deben estar desacoplados del cliente final.

El scraper no debe decidir qué cliente ve un inmueble.

### 6.5. Matching engine

Motor que cruza los inmuebles globales con las búsquedas de cada inmobiliaria.

Debe generar `tenant_listing_matches` y, si procede, oportunidades comerciales.

### 6.6. Pipeline comercial

Gestión de oportunidades:

- nuevo;
- revisar;
- contactar;
- contactado;
- no responde;
- interesado;
- cita programada;
- captado;
- perdido;
- no contactar.

### 6.7. IA asistida

La IA debe ayudar, no decidir sola.

Usos adecuados:

- resumen del inmueble;
- scoring explicable;
- guion de llamada;
- mensaje editable;
- recomendación de siguiente acción;
- resumen de conversación;
- clasificación de interés.

### 6.8. Comunicaciones

Módulo futuro para:

- WhatsApp Business;
- email;
- llamadas;
- click-to-call;
- transcripción;
- registro de actividad.

Debe diseñarse con cumplimiento legal desde el inicio.

---

## 7. Stack recomendado

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- React Hook Form
- Zod
- Recharts o Tremor para dashboards

### Backend

- NestJS
- TypeScript
- REST + OpenAPI
- Prisma inicialmente
- PostgreSQL
- Redis
- BullMQ

### Scraping

- Playwright para fuentes dinámicas
- Workers Node.js
- Python opcional para scoring, limpieza y análisis de datos
- Adaptadores por fuente

### Infraestructura

- Docker
- PostgreSQL gestionado
- Redis gestionado
- S3 compatible para snapshots/documentos
- Vercel para frontend
- API/workers en VPS, Railway, Render, Fly.io o similar
- Sentry para errores

---

## 8. Reglas críticas

1. No crear un scraper por cliente.
2. No mezclar scraping con CRM.
3. No automatizar contacto frío sin revisión humana.
4. No cobrar tarifa plana ilimitada.
5. No construir un CRM completo antes de validar captación.
6. No depender solo de IA.
7. No guardar datos sin trazabilidad de origen.
8. No dejar usuarios, búsquedas o volumen sin límites.
9. No acoplar `tenant_id` dentro de la lógica del scraper.
10. No escalar a microservicios antes de necesitarlo.

---

## 9. Objetivo del MVP

El MVP debe demostrar que una inmobiliaria pagaría por:

- detectar oportunidades antes;
- ahorrar tiempo de búsqueda;
- centralizar inmuebles detectados;
- priorizar oportunidades;
- asignar trabajo a agentes;
- controlar el seguimiento comercial.

Si el MVP no consigue validar eso, no tiene sentido construir WhatsApp, llamadas IA ni CRM completo.

---

## 10. Nombre provisional

Nombres provisionales posibles:

- Radar Inmobiliario
- Captia Real Estate
- PropRadar
- LeadEstate
- InmoRadar
- OwnerRadar

El nombre definitivo debe validarse por disponibilidad de dominio, marca y facilidad comercial.
