# Pricing, planes y límites

## 1. Principio de pricing

No se debe cobrar solo por usuario.

El coste real del producto depende de:

- usuarios/agentes;
- búsquedas activas;
- tamaño de zona/radio;
- densidad de la zona;
- frecuencia de actualización;
- fuentes activas;
- volumen de inmuebles detectados;
- alertas enviadas;
- uso de IA;
- uso de WhatsApp/llamadas.

La fórmula general debe ser:

```text
base mensual
+ usuarios adicionales
+ búsquedas/cobertura adicional
+ frecuencia premium
+ comunicaciones/IA por uso
```

---

# 2. Unidad comercial inicial

Para MVP, la unidad principal será:

```text
Búsqueda activa
```

Una búsqueda activa incluye:

- zona;
- radio;
- operación;
- tipo de inmueble;
- rango de precio;
- fuentes;
- frecuencia.

Más adelante puede evolucionar a:

```text
Coverage Credits
```

---

# 3. Planes iniciales recomendados

## Starter — 99 €/mes

Para agencia pequeña o agente individual.

Incluye:

```text
1 usuario
2 búsquedas activas
radio máximo 5 km
actualización cada 12h
1-2 fuentes
pipeline básico
alertas por email
límite mensual de 500 nuevos inmuebles
```

No incluye:

```text
IA avanzada
llamadas
WhatsApp
integraciones
multi-oficina
```

---

## Pro — 199 €/mes

Plan principal recomendado.

Incluye:

```text
3 usuarios
5 búsquedas activas
radio máximo 10 km
actualización cada 4h
2-3 fuentes
scoring básico
pipeline comercial
alertas rápidas
plantillas comerciales
límite mensual de 2.000 nuevos inmuebles
```

---

## Growth — 349 €/mes

Para inmobiliarias con equipo comercial.

Incluye:

```text
8 usuarios
12 búsquedas activas
radio máximo 20 km
actualización cada 1-2h
fuentes ampliadas
scoring avanzado
asignación por agente
reportes
alertas prioritarias
límite mensual de 7.500 nuevos inmuebles
```

---

## Agency / Enterprise — 599 €+/mes

Para redes, franquicias o inmobiliarias grandes.

Incluye:

```text
usuarios personalizados
búsquedas personalizadas
zonas de alto volumen
frecuencia premium
integraciones
soporte prioritario
SLA opcional
multi-oficina
reportes avanzados
```

Debe ser presupuesto personalizado.

---

# 4. Add-ons

```text
Usuario adicional: 19 €/mes
Búsqueda adicional: 29 €/mes
Pack 5 búsquedas: 99 €/mes
Frecuencia premium: 49-99 €/mes
Pack IA: según créditos
Pack WhatsApp/llamadas: coste + margen
Fuente adicional premium: 30-100 €/mes
Integración externa: desde 99 €/mes
```

---

# 5. Límites por plan

| Límite | Starter | Pro | Growth | Agency |
|---|---:|---:|---:|---:|
| Usuarios incluidos | 1 | 3 | 8 | Personalizado |
| Búsquedas activas | 2 | 5 | 12 | Personalizado |
| Radio máximo | 5 km | 10 km | 20 km | Personalizado |
| Frecuencia | 12h | 4h | 1-2h | Premium |
| Nuevos inmuebles/mes | 500 | 2.000 | 7.500 | Personalizado |
| Fuentes | 1-2 | 2-3 | ampliadas | personalizado |
| Alertas | email | rápidas | prioritarias | avanzado |
| IA | básica/no | básica | avanzada | personalizada |

---

# 6. Zonas de alto volumen

Madrid, Barcelona y otras zonas densas no deben costar lo mismo que ciudades pequeñas.

Cláusula recomendada:

> Las zonas de alto volumen pueden requerir plan superior o presupuesto personalizado según radio, frecuencia y volumen esperado.

---

# 7. Coverage Credits futuros

Cuando el sistema crezca, una búsqueda debe consumir créditos según:

```text
radio
densidad
fuentes
frecuencia
volumen esperado
tipo de zona
```

Ejemplo:

```text
Murcia centro 5 km cada 4h = 2 créditos
Molina de Segura 5 km cada 4h = 1 crédito
Madrid Salamanca 5 km cada 2h = 6 créditos
Barcelona Eixample 10 km cada 2h = 10 créditos
```

Esto evita que una búsqueda enorme cueste igual que una búsqueda pequeña.

---

# 8. Control de rentabilidad

Por cada scrape_area/scrape_plan medir:

```text
active_tenant_count
active_search_count
monthly_jobs
avg_results_per_run
monthly_new_listings
estimated_cost
estimated_revenue
profitability_score
```

Si una zona tiene poco ingreso y mucho coste:

- limitar frecuencia;
- subir plan;
- mover a presupuesto personalizado;
- reducir cobertura;
- negociar con cliente.

---

# 9. Reglas antiabuso

No permitir:

```text
búsquedas ilimitadas
radio ilimitado
frecuencia en tiempo real para planes bajos
exportaciones masivas sin control
usuarios ilimitados en planes baratos
fuentes premium ilimitadas
```

Medidas:

```text
validaciones de plan en backend
cuotas mensuales
avisos de consumo
bloqueo suave
upgrade automático/manual
revisión de zonas caras
```

---

# 10. Recomendación final

Empezar simple:

```text
Starter 99 €
Pro 199 €
Growth 349 €
Agency personalizado
```

Pero diseñar internamente desde el principio para poder evolucionar a:

```text
usuarios + búsquedas + cobertura + frecuencia + volumen + comunicaciones + IA
```

La frase comercial clave:

> No cobras solo por usar un CRM. Cobras por acceso a oportunidades de captación.
