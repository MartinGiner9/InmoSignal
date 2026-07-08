# Riesgos, cumplimiento y decisiones prudentes

## 1. Objetivo

Este documento recoge los principales riesgos del proyecto y las decisiones que deben tomarse para evitar problemas legales, técnicos y comerciales.

---

# 2. Riesgo principal

La parte más valiosa del producto es detectar propietarios particulares rápido.

La parte más peligrosa es automatizar contacto frío por WhatsApp o llamadas a esos propietarios.

El producto debe ser diseñado como:

```text
captación asistida y trazable
```

No como:

```text
máquina automática de spam comercial
```

---

# 3. Reglas de contacto

## Permitido / recomendable

- Preparar guiones.
- Preparar mensajes editables.
- Registrar llamadas manuales.
- Registrar consentimiento/oposición.
- Gestionar leads entrantes.
- Automatizar recordatorios con consentimiento.
- Automatizar respuestas inbound.

## No recomendable

- Enviar WhatsApp frío automático a propietarios detectados.
- Hacer llamadas automáticas frías sin control.
- Extraer teléfonos y contactar masivamente.
- No registrar origen del dato.
- No permitir marcar “no contactar”.

---

# 4. Consentimiento y trazabilidad

El sistema debe registrar:

```text
origen del dato
fecha de detección
fuente
usuario que contactó
canal usado
resultado
oposición/no contactar
consentimiento si existe
```

Tabla recomendada:

```text
consent_records
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

# 5. Auditoría

Auditar acciones sensibles:

```text
mensaje enviado
llamada realizada
cambio de estado
marcado no contactar
exportación de datos
creación/edición de búsqueda
cambio de permisos
```

Esto protege al producto y al cliente.

---

# 6. Scraping

## Riesgos

- bloqueo de fuentes;
- cambios de HTML;
- captchas;
- limitaciones legales/contractuales;
- datos incorrectos;
- duplicados;
- dependencia excesiva de portales concretos.

## Mitigaciones

- adaptadores independientes por fuente;
- reintentos controlados;
- logs por fuente;
- snapshots;
- no sobrecargar fuentes;
- priorizar fuentes autorizadas o acuerdos si el negocio crece;
- monitorización de errores;
- modo degradado si una fuente cae.

---

# 7. IA

## Riesgos

- inventar información;
- sugerir mensajes agresivos;
- clasificar mal una oportunidad;
- generar promesas comerciales falsas;
- dependencia excesiva.

## Mitigaciones

- IA asistida, no autónoma;
- prompts versionados;
- outputs revisables;
- mensajes editables;
- guardar input/output;
- explicar scoring con razones;
- no permitir acciones sensibles sin aprobación humana.

---

# 8. Pricing

## Riesgo

Cobrar barato y permitir uso ilimitado.

Esto puede destruir la rentabilidad.

## Mitigación

Limitar:

```text
usuarios
búsquedas activas
radio
frecuencia
fuentes
volumen mensual
alertas
IA
comunicaciones
```

---

# 9. Arquitectura

## Riesgos técnicos

- scraper por cliente;
- jobs duplicados;
- datos duplicados;
- sin tenant isolation;
- sin colas;
- sin snapshots;
- API bloqueada por scraping;
- costes no medidos.

## Mitigaciones

- scraping global;
- planner automático;
- matching posterior;
- workers separados;
- BullMQ;
- PostgreSQL;
- audit logs;
- métricas de coste por zona;
- deduplicación.

---

# 10. Producto

## Riesgo

Construir demasiado antes de validar.

## Mitigación

Primero validar:

```text
¿Pagan por detectar oportunidades antes?
¿Les ahorra tiempo real?
¿Genera más citas/captaciones?
```

No construir CRM completo hasta que la captación esté validada.

---

# 11. Checklist de cumplimiento mínimo

```text
[ ] Existe opción de marcar no contactar
[ ] Se registra fuente del dato
[ ] Se registra quién contactó
[ ] Se registra cuándo contactó
[ ] Se registra canal de contacto
[ ] Se registra oposición/consentimiento
[ ] Los mensajes generados por IA son editables
[ ] No hay envío automático frío sin revisión
[ ] Hay audit log
[ ] Hay límites por tenant
```

---

# 12. Decisión recomendada

Construir el producto como herramienta de:

```text
captación, priorización y seguimiento comercial
```

No como herramienta de:

```text
automatización masiva de contacto frío
```

La primera opción es vendible y defendible.
La segunda puede generar bloqueos, rechazo comercial y problemas legales.
