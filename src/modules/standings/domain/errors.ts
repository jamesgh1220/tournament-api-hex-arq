import { DomainError } from 'src/common/domain/domain-error';

export class StandingByTournamentNotFoundError extends DomainError {
  readonly code = 'STANDING_BY_TOURNAMENT_NOT_FOUND';
  readonly statusCode = 404;

  constructor(id: string) {
    super(`Tabla de posiciones para el torneo con id ${id} no encontrado`);
  }
}

export class StandingNotFoundError extends DomainError {
  readonly code = 'STANDING_NOT_FOUND';
  readonly statusCode = 404;

  constructor(id: string) {
    super(`Tabla de posiciones con torneo id ${id} no encontrado`);
  }
}

export class StandingPersistenceError extends DomainError {
  readonly code = 'STANDING_PERSISTENCE_ERROR';
  readonly statusCode = 500;

  constructor(message?: string) {
    super(message ?? 'Error al guardar la tabla de posiciones');
  }
}
