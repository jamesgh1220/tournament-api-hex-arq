# AGENTS.md

Instrucciones para agentes que trabajan en este repositorio.

## Proyecto

API REST de torneos deportivos con **arquitectura hexagonal** (puertos y adaptadores) sobre **NestJS 11 + TypeORM + PostgreSQL**. Comentarios y mensajes de error en **español**. Gestor de paquetes: **pnpm**.

## Arquitectura

> **IMPORTANTE:** antes de tocar código con impacto arquitectónico (crear/modificar módulos, use cases, puertos, adapters o transacciones), un agente debe **leer primero**:

- `docs/arquitectura-hexagonal.md` — visión general de capas, estructura de módulos, comunicación inter-módulos (puertos + adapters), wiring DI y guía práctica.
- `docs/unit-of-work-transacciones.md` — mecanismo de transacciones atómicas (`UnitOfWorkPort`, `TransactionContext`, `this.repo()`).

Estructura por módulo: `domain/` (entidades puras + puertos/interfaces + errores), `application/` (use cases planos que inyectan puertos), `infrastructure/` (repositorios TypeORM, entidades ORM, adapters de puertos, controllers + DTOs).

Reglas clave:
- El **dominio no importa** NestJS ni TypeORM. La aplicación solo conoce **puertos**.
- Un módulo no importa la implementación de otro módulo: define su **port** en `domain/ports/` y lo implementa con un **adapter** en `infrastructure/adapters/` que inyecta el use case exportado del proveedor.
- Las operaciones multi-tabla deben ir dentro de `unitOfWork.execute(...)`; las lecturas/validaciones fuera.
- Los repositorios que participan en transacciones usan `this.repo()`.
- Los controllers inyectan **tokens** de use cases (`@Inject(...)`), nunca clases concretas.
- Los puertos de persistencia reciben/entregan **entidades de dominio** completas, no `Partial`.

## Convenciones

- Mensajes de error y nombres de dominio en español.
- Validación de entrada con `class-validator` en DTOs; el `ValidationPipe` global aplica `whitelist` + `forbidNonWhitelisted`.
- Endpoints de eliminación devuelven `204` (`@HttpCode(HttpStatus.NO_CONTENT)`).
- Errores de dominio → excepción HTTP en el controller (`NotFoundException`, `BadRequestException`).

## Comandos

- `pnpm run start:dev` — desarrollo con watch
- `pnpm run lint` — ESLint (con `--fix`)
- `pnpm run build` — compilación Nest
- `pnpm test` — tests unitarios (Jest)
