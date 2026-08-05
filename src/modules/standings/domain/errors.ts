import { DomainError } from 'src/common/domain/domain-error';

export class StandingByTournamentNotFoundError extends DomainError {
  readonly code = 'STANDING_BY_TOURNAMENT_NOT_FOUND';
  readonly statusCode = 404;

  constructor(id: string) {
    super(`Tabla de posiciones para el torneo con id ${id} no encontrado`);
  }
}
