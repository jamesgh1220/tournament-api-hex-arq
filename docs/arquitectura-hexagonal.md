# Arquitectura Hexagonal del Tournament API

Este documento describe cómo el proyecto aplica **arquitectura hexagonal** (puertos y adaptadores) sobre **NestJS 11 + TypeORM + PostgreSQL**.

Complementa a [`docs/unit-of-work-transacciones.md`](./unit-of-work-transacciones.md), que explica en detalle el mecanismo de transacciones atómicas.

---

## 1. Principio rector

La aplicación se organiza en **módulos de feature** (uno por agregado/dominio) con **capas estrictas por módulo**:

```
┌───────────────────────────────────────────────────────────────┐
│  Infrastructure / Presentation (HTTP)                          │
│  Controllers, DTOs, guards, interceptors, filtros              │
├───────────────────────────────────────────────────────────────┤
│  Infrastructure / Persistence + Adapters                       │
│  Repositorios TypeORM, entidades ORM, adapters de puertos      │
├───────────────────────────────────────────────────────────────┤
│  Application                                                   │
│  Use cases (clases planas). Orquestan puertos.                 │
├───────────────────────────────────────────────────────────────┤
│  Domain                                                        │
│  Entidades, value objects, errores, puertos (interfaces)       │
└───────────────────────────────────────────────────────────────┘
```

**Regla de dependencia:** el dominio no importa nada externo (ni NestJS ni TypeORM). La aplicación solo conoce **puertos** (interfaces). La infraestructura implementa los puertos y los conecta mediante el contenedor de inyección de NestJS.

---

## 2. Estructura de un módulo

Cada módulo en `src/modules/<modulo>/` sigue este esqueleto:

```
<modulo>/
├── <modulo>.module.ts              # Wiring NestJS: DI, exports, controllers
├── <modulo>.tokens.ts              # Tokens de inyección (Symbol o string)
├── domain/
│   ├── <entidad>.entity.ts         # Agregado puro (creación + invariantes)
│   ├── <repositorio>.port.ts       # Puertos de persistencia (interfaces)
│   ├── errors.ts                   # Errores de dominio
│   ├── value-objects/              # Value objects
│   └── ports/                      # Puertos hacia OTROS módulos (outbound)
├── application/
│   └── <accion>.use-case.ts        # Use cases (clases planas)
└── infrastructure/
    ├── http/                       # Controllers + DTOs (presentación)
    ├── persistence/                # Entidades TypeORM + repositorios
    └── adapters/                   # Implementaciones de puertos inter-módulo
```

### 2.1 Responsabilidades por capa

| Capa | Responsabilidad | Qué conoce | Qué NO conoce |
|------|-----------------|------------|---------------|
| **Domain** | Entidades, reglas de negocio, VOs, contratos (ports) | Solo TS puro | NestJS, TypeORM, HTTP, otros módulos |
| **Application** | Orquestar la operación de negocio | Puertos del dominio | TypeORM, HTTP, NestJS |
| **Infrastructure/Persistence** | Persistir entidades | TypeORM, entidades ORM | Reglas de negocio |
| **Infrastructure/Http** | Recibir peticiones, validar DTOs, responder | Use cases (vía tokens) | Lógica de negocio |
| **Infrastructure/Adapters** | Implementar puertos hacia otros módulos | Use cases exportados de otros módulos | — |

---

## 3. Módulos del proyecto

| Módulo | Carpeta | Rol principal | Puertos de dominio | Puertos inter-módulo |
|--------|---------|---------------|--------------------|----------------------|
| `tournaments` | `modules/tournaments` | Orquestador: torneos, equipos, fases, fixtures | `TournamentRepositoryPort` | `TeamLookupPort`, `PhaseSetupPort`, `PhaseLookupPort`, `PhaseTypePort`, `FixtureGenerationPort` |
| `phases` | `modules/phases` | Fases de un torneo | `PhaseRepositoryPort` | — |
| `phases_types` | `modules/phases_types` | Tipos de fase | `PhaseTypeRepositoryPort` | — |
| `matches` | `modules/matches` | Partidos y generación de fixtures | `MatchRepositoryPort` | — |
| `teams` | `modules/teams` | Equipos | `TeamRepositoryPort` | — |
| `groups` | `modules/groups` | Grupos | `GroupRepositoryPort` | — |
| `standings` | `modules/standings` | Tablas de posiciones | `StandingRepositoryPort` | — |
| `users` | `modules/users` | Autenticación y usuarios | `UserRepositoryPort`, `UserPort` (login) | — |
| `tasks` | `modules/tasks` | Ejemplo de persistencia in-memory | `TaskRepositoryPort` | `UserLookupPort` |

---

## 4. Comunicación entre módulos: puertos + adapters

### 4.1 El patrón

Cuando un módulo necesita una capacidad de otro módulo, **no importa su implementación** sino que:

1. **El módulo consumidor define su propio puerto** en `domain/ports/*.port.ts` (una interfaz con el contrato mínimo que necesita).
2. **La infraestructura del consumidor** implementa ese puerto con un **adapter** en `infrastructure/adapters/` que inyecta el **use case exportado** del módulo proveedor.
3. NestJS conecta el puerto al adapter mediante el token de inyección.

Esto es **inversión de dependencias**: el dominio de `tournaments` conoce `TeamLookupPort`, nunca `TeamsModule` ni su repositorio.

### 4.2 Ejemplo real: Tournaments → Teams

`tournaments/domain/ports/team-lookup.port.ts`:

```typescript
export interface TeamLookupPort {
  findById(id: string): Promise<TeamTournament | null>;
}
```

`tournaments/infrastructure/adapters/team-lookup.adapter.ts`:

```typescript
export class TeamLookupAdapter implements TeamLookupPort {
  constructor(
    @Inject(GET_TEAM_USE_CASE)          // token exportado por TeamsModule
    private readonly getTeamUseCase: GetTeamUseCase,
  ) {}

  async findById(id: string): Promise<TeamTournament | null> { ... }
}
```

`tournaments.module.ts`:

```typescript
{
  provide: TEAM_LOOKUP,                 // token del puerto
  useClass: TeamLookupAdapter,          // implementación
}
```

### 4.3 Mapa de adapters existentes

| Adapter | Puerto que implementa | Use case que consume |
|---------|------------------------|----------------------|
| `TeamLookupAdapter` (tournaments) | `TeamLookupPort` | `GET_TEAM_USE_CASE` (teams) |
| `PhaseSetupAdapter` (tournaments) | `PhaseSetupPort` | `CREATE_PHASE_USE_CASE` (phases) |
| `PhaseLookupAdapter` (tournaments) | `PhaseLookupPort` | `GET_PHASE_BY_STATUS_USE_CASE`, `HAS_ASSIGNED_FIXTURE_PHASE_USE_CASE` (phases) |
| `PhaseTypeAdapter` (tournaments) | `PhaseTypePort` | `GET_PHASE_TYPE_BY_NAME_USE_CASE` (phases_types) |
| `FixtureGenerationAdapter` (tournaments) | `FixtureGenerationPort` | `GENERATE_MATCHES_USE_CASE` (matches) |
| `UserModuleLookupAdapter` (tasks) | `UserLookupPort` | `GET_USER_USE_CASE` (users) |

### 4.4 Grafo de imports entre módulos

```
TournamentsModule ──importa──> TeamsModule, PhasesModule, PhasesTypesModule, MatchesModule
TasksModule       ──importa──> UsersModule
UsersModule       ──exporta──> GET_USER_USE_CASE, PassportModule
SharedModule      ──@Global()──> UNIT_OF_WORK (disponible en cualquier módulo)
```

> Nota: las entidades ORM se cruzan entre módulos (p. ej. `match.orm.ts` importa `team.orm.ts`, `group.orm.ts`, `phase.orm.ts`) para declarar relaciones de TypeORM. Es acoplamiento **solo a nivel de infraestructura**, aceptable.

---

## 5. Inyección de dependencias

### 5.1 Tokens

Cada módulo define tokens (`Symbol` o string) en `<modulo>.tokens.ts` para puertos y use cases.

```typescript
export const MATCH_REPOSITORY = 'MATCH_REPOSITORY';
export const GET_MATCH_USE_CASE = 'GET_MATCH_USE_CASE';
export const GENERATE_MATCHES_USE_CASE = Symbol('GENERATE_MATCHES_USE_CASE');
```

### 5.2 Estilos de binding

**Puerto → implementación (useClass):**

```typescript
{ provide: MATCH_REPOSITORY, useClass: MatchRepository },
{ provide: TEAM_LOOKUP, useClass: TeamLookupAdapter },
```

**Use case (useFactory + inject):**

```typescript
{
  provide: CREATE_TOURNAMENT_USE_CASE,
  useFactory: (tournamentRepository: TournamentRepositoryPort, unitOfWork: UnitOfWorkPort) =>
    new CreateTournamentUseCase(tournamentRepository, unitOfWork),
  inject: [TOURNAMENT_REPOSITORY, UNIT_OF_WORK],
},
```

**Servicio de dominio registrado por clase:**

```typescript
providers: [FixtureGenerator],
```

### 5.3 Controllers

Los controllers **nunca importan clases concretas de use cases**; inyectan el token:

```typescript
constructor(
  @Inject(GET_MATCH_USE_CASE)
  private readonly getMatchUseCase: GetMatchUseCase,
) {}
```

---

## 6. Transacciones: Unit of Work

El mecanismo está documentado en [`docs/unit-of-work-transacciones.md`](./unit-of-work-transacciones.md). Resumen:

- `UnitOfWorkPort` (aplicación) → `TypeOrmUnitOfWork` (infra) usa `DataSource.transaction()`.
- `TransactionContext` propaga el `EntityManager` con `AsyncLocalStorage`.
- Los repositorios que participan en flujos atómicos usan `this.repo()`:

```typescript
private repo(): Repository<MatchOrmEntity> {
  const manager = TransactionContext.getManager();
  return manager
    ? manager.getRepository(MatchOrmEntity)
    : this.matchRepository;
}
```

- `SharedModule` es `@Global()` y exporta `UNIT_OF_WORK`, por lo que no hace falta importarlo en cada feature module.

---

## 7. Infraestructura transversal

| Pieza | Ubicación | Rol |
|-------|-----------|-----|
| `ApiResponse<T>` | `src/common/interfaces/api-response.interface.ts` | Envelope de respuesta `{ success, statusCode, message, data, error, timestamp }` |
| `ResponseInterceptor` | `src/common/interceptors/response.interceptor.ts` | Global; envuelve respuestas exitosas (salvo HTTP 204) |
| `HttpExceptionFilter` | `src/common/filters/http-exception.filter.ts` | Global; normaliza `HttpException` en el envelope |
| `DomainExceptionFilter` | `src/common/filters/domain-exception.filter.ts` | Global; traduce `DomainError` → HTTP según `statusCode`/`code` |
| `DomainError` | `src/common/domain/domain-error.ts` | Clase base de errores de dominio (sin NestJS) |
| `JwtAuthGuard` | `src/common/guards/jwt-auth-guard.ts` | Guard JWT aplicado por controller |
| `ValidationPipe` | `src/main.ts` | `whitelist: true, forbidNonWhitelisted: true` → fuerza validación estricta de DTOs |

### `main.ts`

```typescript
app.enableCors();
app.useGlobalInterceptors(new ResponseInterceptor());
app.useGlobalFilters(new DomainExceptionFilter(), new HttpExceptionFilter());
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  transform: true,
  forbidNonWhitelisted: true,
}));
```

---

## 8. Guía práctica para agregar/modificar funcionalidad

### 8.1 Nuevo use case dentro de un módulo

1. Implementar la clase en `application/<accion>.use-case.ts` inyectando solo puertos.
2. Registrar el token en `<modulo>.tokens.ts` si no existe.
3. Registrar el provider en `<modulo>.module.ts` con `useFactory`/`useClass`.
4. Si el módulo debe exponerlo a otros: añadirlo a `exports`.
5. Consumirlo en un controller inyectando el token.

### 8.2 El módulo necesita algo de otro módulo

1. Definir el **puerto** en `domain/ports/<capacidad>.port.ts` con el contrato mínimo.
2. Implementar el **adapter** en `infrastructure/adapters/` inyectando el use case exportado del proveedor.
3. Registrar `{ provide: PUERTO, useClass: Adapter }` en el módulo.
4. Importar el módulo proveedor en el consumidor (para que su use case esté disponible).
5. Inyectar el puerto en el use case de aplicación.

### 8.3 Operaciones que tocan varias tablas

Envolver las escrituras con `unitOfWork.execute(...)` (ver doc de transacciones). Las lecturas/validaciones van **fuera** de la transacción.

---

## 9. Inconsistencias y deuda técnica conocida

- `MatchRepository.create()` no usa `this.repo()` (solo `createMany`), así que no participa en transacciones.
- `TournamentsModule` registra `REMOVE_TEAM_FROM_TOURNAMENT_USE_CASE` **dos veces**.
- Tokens `UPDATE_*` de tournaments/teams/groups/standings están declarados pero **no registrados** como providers (históricamente el update no estaba implementado). El update de `matches` ya está implementado (`PATCH /matches/:id`).
- `standing.repository.ts` mapea mal `goalsAgainst: orm.goalsFor`.
- Typo en `task.reporitory.port.ts` (nombre de archivo) y en `hasAssignedFixturehasAssignedFixture` (método del puerto de phases).
- Tipos duplicados: `GeneratedMatchSummary` se redefine en varios archivos con TODO "llevar a tipos generales de dominio".
- Mezcla de estilos de tokens: `Symbol` vs `string`.
- Repositorios con `update` sin implementar: teams, groups, standings, phase-types.

---

## 10. Referencias

- `docs/unit-of-work-transacciones.md` — mecanismo de transacciones atómicas.
- `src/shared/` — puerto y implementación de Unit of Work.
- `src/modules/tournaments/` — el módulo más completo (orquestación multi-módulo).
- `src/modules/tasks/` — ejemplo de puerto inter-módulo + persistencia in-memory.
