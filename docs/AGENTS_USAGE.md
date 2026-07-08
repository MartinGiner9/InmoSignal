# Uso recomendado de agentes

## Flujo de trabajo ideal

Para una feature:

1. `00-master-orchestrator.md` define el objetivo y divide tareas.
2. Elige agente principal:
   - Modelo de datos: `04-database-prisma.md`
   - API: `05-backend-nestjs.md`
   - Planner: `06-scraping-planner.md`
   - Workers: `08-workers-queues.md`
   - Frontend: `09-frontend-nextjs.md`
3. Implementa con cambios pequeños.
4. Pasa validaciones.
5. Revisa con `16-code-reviewer.md`.

## Qué agente usar según tarea

| Tarea | Agente |
|---|---|
| Definir roadmap, MVP o pricing | `01-product-strategy.md` |
| Revisar arquitectura general | `02-software-architect.md` |
| Mantener monorepo, scripts, pnpm, turbo | `03-repo-steward.md` |
| Prisma, migraciones, relaciones | `04-database-prisma.md` |
| Endpoints, módulos, servicios NestJS | `05-backend-nestjs.md` |
| TenantSearch -> ScrapeDemand -> ScrapePlan | `06-scraping-planner.md` |
| Adapters Crawlee/Playwright/Cheerio | `07-scraping-adapter.md` |
| BullMQ, workers, scheduler | `08-workers-queues.md` |
| Dashboard Next.js | `09-frontend-nextjs.md` |
| Diseño SaaS, componentes, UX | `10-ui-ux-saas.md` |
| Tests y QA | `11-qa-testing.md` |
| Docker, CI, despliegue | `12-devops-ci.md` |
| Legal, privacidad, seguridad | `13-security-compliance.md` |
| WhatsApp, llamadas, email | `14-integrations-communications.md` |
| IA, prompts, automatización asistida | `15-ai-automation.md` |
| Revisión crítica antes de merge | `16-code-reviewer.md` |

## Recomendación importante

No uses un agente general para todo. Es mejor lanzar prompts pequeños:

```txt
Usa el agente 04 para ajustar Prisma.
Luego usa el agente 05 para exponer endpoints.
Luego usa el agente 11 para tests.
Luego usa el agente 16 para revisión.
```
