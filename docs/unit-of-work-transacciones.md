# Unit of Work y transacciones

Este documento explica cómo la aplicación garantiza que varias escrituras a base de datos se ejecuten de forma **atómica** (todas o ninguna), sin acoplar los use cases a TypeORM.

El patrón implementado es **Unit of Work (UoW)**, expuesto como puerto hexagonal y respaldado por `DataSource.transaction()` de TypeORM más un contexto compartido (`TransactionContext`).

---

## ¿Qué problema resuelve?

En arquitectura hexagonal, un use case suele orquestar **varios puertos** (repositorios / adapters) que, por debajo, escriben en tablas distintas.

Ejemplo sin transacción:

1. Se inserta el torneo → OK  
2. Falla la inserción de la fase  

Resultado: el torneo queda **huérfano** en BD. Cada `save()` se confirma por su cuenta.

Con Unit of Work:

1. Se abre una transacción (`BEGIN`)  
2. Se ejecutan todas las escrituras dentro de esa misma transacción  
3. Si todo sale bien → `COMMIT`  
4. Si cualquiera falla → `ROLLBACK` (nada queda persistido)

---

## Piezas del sistema

| Pieza | Ubicación | Rol |
|-------|-----------|-----|
| `UnitOfWorkPort` | `src/shared/application/ports/unit-of-work.port.ts` | Contrato de aplicación: “ejecuta este bloque de forma atómica” |
| `UNIT_OF_WORK` | `src/shared/shared.tokens.ts` | Token de inyección NestJS (`Symbol`) |
| `TypeOrmUnitOfWork` | `src/shared/infrastructure/persistence/typeorm-unit-of-work.ts` | Implementación con TypeORM (`DataSource.transaction`) |
| `TransactionContext` | `src/shared/infrastructure/persistence/transaction-context.ts` | Propaga el `EntityManager` de la transacción sin pasarlo por los puertos |
| `SharedModule` | `src/shared/shared.module.ts` | Registra y exporta el UoW; es `@Global()` |

### Capas y responsabilidades

```
┌─────────────────────────────────────────────────────────┐
│  Aplicación (use cases)                                 │
│  Decide QUÉ operaciones deben ser atómicas              │
│  Solo conoce UnitOfWorkPort                             │
├─────────────────────────────────────────────────────────┤
│  Dominio                                                │
│  Entidades, reglas, puertos de persistencia             │
│  No conoce transacciones ni TypeORM                     │
├─────────────────────────────────────────────────────────┤
│  Infraestructura                                        │
│  TypeOrmUnitOfWork + TransactionContext + Repositorios  │
│  Saben CÓMO hacer BEGIN / COMMIT / ROLLBACK             │
└─────────────────────────────────────────────────────────┘
```

Esto respeta hexagonal: la aplicación no importa `DataSource`, `QueryRunner` ni `EntityManager`.

---

## `UnitOfWorkPort`

```typescript
export interface UnitOfWorkPort {
  execute<T>(work: () => Promise<T>): Promise<T>;
}
```

- Recibe un callback (`work`) con la lógica a ejecutar.  
- Devuelve el resultado de ese callback.  
- Si el callback lanza un error, la implementación hace rollback.

El use case no sabe si por debajo hay Postgres, TypeORM u otra tecnología: solo llama a `unitOfWork.execute(...)`.

---

## `TypeOrmUnitOfWork` — el “beginTransaction”

```typescript
@Injectable()
export class TypeOrmUnitOfWork implements UnitOfWorkPort {
  constructor(private readonly dataSource: DataSource) {}

  execute<T>(work: () => Promise<T>): Promise<T> {
    return this.dataSource.transaction((manager) =>
      TransactionContext.run(manager, work),
    );
  }
}
```

Qué ocurre al llamar `execute`:

1. **`dataSource.transaction(...)`** abre una transacción real en la BD (equivalente a `BEGIN`).
2. TypeORM entrega un **`EntityManager`** ligado a esa transacción.
3. Ese manager se guarda en **`TransactionContext`** mientras corre el callback.
4. Si `work` termina bien → TypeORM hace **`COMMIT`**.
5. Si `work` lanza → TypeORM hace **`ROLLBACK`**.

El use case nunca ve el `manager`; solo el callback.

---

## `TransactionContext` — cómo se comparte la transacción

### El problema que resuelve

Los repositorios están en módulos distintos (`tournaments`, `phases`, `matches`, `standings`) y cada uno tiene su propio `@InjectRepository(...)`.

Si cada repo usa su `Repository` inyectado por defecto, **no participa** en la transacción abierta por `DataSource.transaction()`.

Hay que hacer que, **mientras hay una transacción activa**, todos los repos usen el mismo `EntityManager`.

Pasar el `EntityManager` como parámetro por cada método de puerto contaminaría el dominio con TypeORM. Por eso se usa **AsyncLocalStorage**.

### Qué es AsyncLocalStorage

`AsyncLocalStorage` (módulo `async_hooks` de Node) permite guardar un valor asociado al **flujo asíncrono actual** (request / cadena de `await`), de forma similar a un “contexto local” del hilo, pero para async.

Mientras el callback del UoW está en ejecución (y en todos sus `await` hijos), cualquier código puede preguntar: “¿hay un manager transaccional activo?”.

### Implementación

```typescript
export class TransactionContext {
  private static readonly storage = new AsyncLocalStorage<EntityManager>();

  static run<T>(manager: EntityManager, fn: () => Promise<T>): Promise<T> {
    return this.storage.run(manager, fn);
  }

  static getManager(): EntityManager | undefined {
    return this.storage.getStore();
  }
}
```

| Método | Qué hace |
|--------|----------|
| `run(manager, fn)` | Ejecuta `fn` con `manager` disponible en el store del ALS |
| `getManager()` | Devuelve el manager activo, o `undefined` si no hay transacción |

Fuera de un `unitOfWork.execute`, `getManager()` es `undefined` y los repos trabajan con su repositorio normal (comportamiento habitual).

---

## Cómo lo usan los repositorios

Cada repositorio que escribe dentro de flujos atómicos sigue este patrón:

```typescript
private repo(): Repository<TournamentOrmEntity> {
  const manager = TransactionContext.getManager();
  return manager
    ? manager.getRepository(TournamentOrmEntity)
    : this.tournamentRepository;
}

async create(tournament: Tournament): Promise<Tournament> {
  const saved = await this.repo().save(this.toOrm(tournament));
  return this.toDomain(saved);
}
```

- **Con transacción activa:** `manager.getRepository(...)` → misma conexión/transacción del UoW.  
- **Sin transacción:** usa el `@InjectRepository` habitual.

Los **puertos** (`TournamentRepositoryPort`, `PhaseRepositoryPort`, etc.) **no cambian**: siguen siendo interfaces puras de dominio.

### Repositorios preparados para transacciones

| Módulo | Archivo |
|--------|---------|
| Tournaments | `src/modules/tournaments/infrastructure/persistence/tournament.repository.ts` |
| Phases | `src/modules/phases/infrastructure/persistence/phase.repository.ts` |
| Matches | `src/modules/matches/infrastructure/persistence/match.repository.ts` |
| Standings | `src/modules/standings/infrastructure/persistence/standing.repository.ts` |

Importante: los métodos de escritura que deben participar en el UoW deben llamar a `this.repo()`, no al repositorio inyectado a pelo.

---

## Cableado en NestJS (módulos)

### 1. `SharedModule` (global)

```typescript
@Global()
@Module({
  providers: [
    { provide: UNIT_OF_WORK, useClass: TypeOrmUnitOfWork },
  ],
  exports: [UNIT_OF_WORK],
})
export class SharedModule {}
```

`@Global()` hace que `UNIT_OF_WORK` esté disponible en todos los feature modules sin reimportar `SharedModule` en cada uno.

### 2. Registro en `AppModule`

`SharedModule` se importa en `src/app.module.ts` junto al resto de módulos. TypeORM ya está configurado con `TypeOrmModule.forRootAsync`, así que `TypeOrmUnitOfWork` puede inyectar `DataSource`.

### 3. Inyección en factories de use cases

Ejemplo en `TournamentsModule` para crear un torneo:

```typescript
{
  provide: CREATE_TOURNAMENT_USE_CASE,
  useFactory: (
    tournamentRepository: TournamentRepositoryPort,
    phaseSetupAdapter: PhaseSetupPort,
    phaseTypeAdapter: PhaseTypePort,
    unitOfWork: UnitOfWorkPort,
  ) =>
    new CreateTournamentUseCase(
      tournamentRepository,
      phaseSetupAdapter,
      phaseTypeAdapter,
      unitOfWork,
    ),
  inject: [
    TOURNAMENT_REPOSITORY,
    PHASE_SETUP,
    PHASE_TYPE_PORT,
    UNIT_OF_WORK,
  ],
}
```

El use case recibe `UnitOfWorkPort` por constructor; Nest resuelve `UNIT_OF_WORK` → `TypeOrmUnitOfWork`.

---

## Uso en use cases

### `CreateTournamentUseCase`

Varias escrituras: torneo + fase (vía `PhaseSetupPort`).

```typescript
return this.unitOfWork.execute(async () => {
  const tournament = Tournament.create(...);
  const saved = await this.tournamentRepository.create(tournament);

  if (saved && tournament.shouldCreatePhaseAutomatically()) {
    const phaseType = await this.phaseTypeAdapter.findByName('LEAGUE');
    if (phaseType?.id) {
      await this.phaseSetupAdapter.create(...);
    }
  }

  return saved;
});
```

Si falla `phaseSetupAdapter.create`, el torneo **no** queda guardado.

Cadena real bajo el adapter:

```
CreateTournamentUseCase
  → PhaseSetupAdapter
    → CreatePhaseUseCase
      → PhaseRepository.create  ← usa TransactionContext.getManager()
```

Mientras el bloque esté dentro de `unitOfWork.execute`, el `PhaseRepository` ve el mismo manager que el `TournamentRepository`.

### `GenerateFixtureUseCase`

Las **lecturas/validaciones** pueden ir fuera de la transacción; las **escrituras** van dentro:

```typescript
const tournament = await this.tournamentRepository.getTournamentWithTeams(tournamentId);
// ... validaciones ...
const activePhase = await this.phaseLookup.findActiveByTournament(tournamentId);
// ... validaciones ...

return this.unitOfWork.execute(async () => {
  const matches = await this.fixtureGeneration.generateAndPersist({ ... });
  // luego: standingSetup.initialize(...)
  return matches;
});
```

Cuando se añada `standingSetup.initialize`, si falla la inicialización de standings, los matches creados en ese mismo bloque también se revierten (siempre que `MatchRepository` / `StandingRepository` usen `this.repo()`).

---

## Flujo completo (secuencia)

```
HTTP / Controller
        │
        ▼
UseCase.execute(...)
        │
        ▼
unitOfWork.execute(async () => { ... })     ← UnitOfWorkPort
        │
        ▼
TypeOrmUnitOfWork
  DataSource.transaction(manager => ...)    ← BEGIN
        │
        ▼
TransactionContext.run(manager, work)      ← ALS guarda el manager
        │
        ├─► tournamentRepository.create()
        │     TransactionContext.getManager() → manager
        │     manager.getRepository(...).save(...)
        │
        ├─► phaseSetupAdapter.create()
        │     → CreatePhaseUseCase
        │     → phaseRepository.create()
        │         TransactionContext.getManager() → mismo manager
        │
        └─► (otras escrituras del bloque)
        │
        ▼
  éxito → COMMIT
  error → ROLLBACK
```

---

## Diagrama de dependencias

```
AppModule
  └── SharedModule (@Global)
        provide: UNIT_OF_WORK → TypeOrmUnitOfWork
              │
              │  (inyectable en cualquier módulo)
              ▼
TournamentsModule
  factories de use cases inyectan UNIT_OF_WORK
              │
              ▼
CreateTournamentUseCase / GenerateFixtureUseCase
  usan UnitOfWorkPort + puertos de dominio
              │
              ▼
Adapters / Repositorios ORM
  leen TransactionContext.getManager()
```

---

## Cuándo usar (y cuándo no) el UoW

| Situación | ¿Usar `unitOfWork.execute`? |
|-----------|-----------------------------|
| Varias escrituras que deben ser atómicas (torneo + fase, matches + standings) | Sí |
| Una sola escritura (`create` de un recurso vía su endpoint) | No es necesario |
| Solo lecturas / validaciones | No |
| Compensaciones manuales (“si falla, borro lo anterior”) | Evitar; preferir UoW |

Regla práctica: **el use case orquestador** abre la transacción; los adapters y use cases secundarios no abren otra distinta.

---

## Cómo añadir un nuevo flujo atómico

1. Inyectar `UnitOfWorkPort` (`UNIT_OF_WORK`) en el use case.  
2. Envolver el bloque de escrituras con `this.unitOfWork.execute(async () => { ... })`.  
3. Asegurar que **todos** los repositorios que escriben en ese bloque usen `TransactionContext` vía `this.repo()`.  
4. Actualizar la `useFactory` / `inject` del módulo correspondiente.

No hace falta tocar `UnitOfWorkPort` ni `TransactionContext` para cada caso nuevo.

---

## Resumen

- **`UnitOfWorkPort`**: contrato hexagonal de “transacción”.  
- **`TypeOrmUnitOfWork`**: `BEGIN` / `COMMIT` / `ROLLBACK` con TypeORM.  
- **`TransactionContext`**: reparte el `EntityManager` a los repos con AsyncLocalStorage, sin ensuciar los puertos.  
- **Use cases**: deciden el perímetro atómico.  
- **Módulos Nest**: cablean el token `UNIT_OF_WORK` en las factories.  
- **Repositorios**: si hay manager activo, escriben dentro de esa transacción.

Así la aplicación obtiene atomicidad entre módulos distintos sin romper la arquitectura hexagonal.
