import { DomainError } from 'src/common/domain/domain-error';

export class PhaseByIdNotFoundError extends DomainError {
  readonly code = 'PHASE_BY_ID_NOT_FOUND';
  readonly statusCode = 404;

  constructor(id: string) {
    super(`Fase con id ${id} no encontrada.`);
  }
}

export class PhaseByStatusNotFoundError extends DomainError {
  readonly code = 'PHASE_BY_STATUS_NOT_FOUND';
  readonly statusCode = 404;

  constructor(status: string) {
    super(`Fase con estado ${status} no encontrada.`);
  }
}

export class PhaseByTournamentNotFoundError extends DomainError {
  readonly code = 'PHASE_BY_TOURNAMENT_NOT_FOUND';
  readonly statusCode = 404;

  constructor(tournamentId: string) {
    super(`Fase para el torneo con id ${tournamentId} no encontrada.`);
  }
}
