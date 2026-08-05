import { DomainError } from 'src/common/domain/domain-error';

export class TournamentNotFoundError extends DomainError {
  readonly code = 'TOURNAMENT_NOT_FOUND';
  readonly statusCode = 404;

  constructor(id: string) {
    super(`Torneo con id ${id} no encontrado`);
  }
}

export class TeamNotFoundError extends DomainError {
  readonly code = 'TEAM_NOT_FOUND';
  readonly statusCode = 404;

  constructor(id: string) {
    super(`Equipo con id ${id} no encontrado`);
  }
}

export class TeamAlreadyInTournamentError extends DomainError {
  readonly code = 'TEAM_ALREADY_IN_TOURNAMENT';
  readonly statusCode = 409;

  constructor(teamId: string) {
    super(`El equipo ${teamId} ya está en el torneo`);
  }
}

export class TeamNotInTournamentError extends DomainError {
  readonly code = 'TEAM_NOT_IN_TOURNAMENT';
  readonly statusCode = 404;

  constructor(teamId: string) {
    super(`El equipo ${teamId} no está en el torneo`);
  }
}

export class InvalidTournamentTypeError extends DomainError {
  readonly code = 'INVALID_TOURNAMENT_TYPE';
  readonly statusCode = 400;

  constructor(type: string) {
    super(`Tipo de torneo inválido: ${type}`);
  }
}

export class PhaseNotFoundError extends DomainError {
  readonly code = 'PHASE_NOT_FOUND';
  readonly statusCode = 404;

  constructor(id: string) {
    super(`La fase con id ${id} no se ha encontrado.`);
  }
}

export class PhaseActiveByTournamentNotFoundError extends DomainError {
  readonly code = 'PHASE_ACTIVE_BY_TOURNAMENT_NOT_FOUND';
  readonly statusCode = 404;

  constructor(tournamentId: string) {
    super(
      `La fase activa para el torneo con id ${tournamentId} no se ha encontrado.`,
    );
  }
}

export class PhaseTypeByNameNotFoundError extends DomainError {
  readonly code = 'PHASE_TYPE_BY_NAME_NOT_FOUND';
  readonly statusCode = 404;

  constructor(name: string) {
    super(`Tipo de fase con nombre ${name} no encontrado`);
  }
}

export class GenerateGixtureTournamentError extends DomainError {
  readonly code = 'GENERATE_FIXTURE_TOURNAMENT_ERROR';
  readonly statusCode = 400;

  constructor(tournamentId: string) {
    super(`Error generando el fixture para el torneo con id ${tournamentId}`);
  }
}

export class InsufficientTeamsForFixtureError extends DomainError {
  readonly code = 'INSUFFICIENT_TEAMS_FOR_FIXTURE';
  readonly statusCode = 400;

  constructor(tournamentId: string, teamCount: number) {
    super(
      `El torneo ${tournamentId} necesita al menos 2 equipos para generar fixture (tiene ${teamCount})`,
    );
  }
}

export class PhaseHasAssignedFixtureError extends DomainError {
  readonly code = 'PHASE_HAS_ASSIGNED_FIXTURE';
  readonly statusCode = 400;

  constructor(phaseId: string) {
    super(`La fase con id ${phaseId} ya tiene un fixture asignado.`);
  }
}

export class MatchNotFoundError extends DomainError {
  readonly code = 'MATCH_TOURNAMENT_NOT_FOUND';
  readonly statusCode = 404;

  constructor(id: string, phaseId: string) {
    super(`Partido con id ${id} no encontrado en la fase con id ${phaseId}`);
  }
}

export class InvalidMatchScoreError extends DomainError {
  readonly code = 'INVALID_MATCH_SCORE';
  readonly statusCode = 400;

  constructor() {
    super('Los goles deben ser enteros mayores o iguales a cero');
  }
}

export class InvalidMatchStatusError extends DomainError {
  readonly code = 'INVALID_MATCH_STATUS';
  readonly statusCode = 400;

  constructor(status: string) {
    super(`El estado del partido no es válido: ${status}`);
  }
}
