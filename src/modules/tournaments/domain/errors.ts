export class TournamentNotFoundError extends Error {
  constructor(id: string) {
    super(`Torneo con id ${id} no encontrado`);
    this.name = 'TournamentNotFoundError';
  }
}

export class TeamNotFoundError extends Error {
  constructor(id: string) {
    super(`Equipo con id ${id} no encontrado`);
    this.name = 'TeamNotFoundError';
  }
}

export class TeamAlreadyInTournamentError extends Error {
  constructor(teamId: string) {
    super(`El equipo ${teamId} ya está en el torneo`);
    this.name = 'TeamAlreadyInTournamentError';
  }
}

export class TeamNotInTournamentError extends Error {
  constructor(teamId: string) {
    super(`El equipo ${teamId} no está en el torneo`);
    this.name = 'TeamNotInTournamentError';
  }
}

export class InvalidTournamentTypeError extends Error {
  constructor(type: string) {
    super(`Tipo de torneo inválido: ${type}`);
    this.name = 'InvalidTournamentTypeError';
  }
}

export class PhaseNotFoundError extends Error {
  constructor(id: string) {
    super(`La fase con id ${id} no se ha encontrado.`);
    this.name = 'PhaseNotFoundError';
  }
}

export class PhaseActiveByTournamentNotFoundError extends Error {
  constructor(tournamentId: string) {
    super(`La fase activa para el torneo con id ${tournamentId} no se ha encontrado.`);
    this.name = 'PhaseActiveByTournamentNotFoundError';
  }
}

export class PhaseTypeByNameNotFoundError extends Error {
  constructor(name: string) {
    super(`Tipo de fase con nombre ${name} no encontrado`);
    this.name = 'PhaseTypeByNameNotFoundError';
  }
}

export class GenerateGixtureTournamentError extends Error {
  constructor(tournamentId: string) {
    super(`Error generando el fixture para el torneo con id ${tournamentId}`);
    this.name = 'GenerateGixtureTournamentError';
  }
}

export class InsufficientTeamsForFixtureError extends Error {
  constructor(tournamentId: string, teamCount: number) {
    super(
      `El torneo ${tournamentId} necesita al menos 2 equipos para generar fixture (tiene ${teamCount})`,
    );
    this.name = 'InsufficientTeamsForFixtureError';
  }
}

export class PhaseHasAssignedFixtureError extends Error {
  constructor(phaseId: string) {
    super(`La fase con id ${phaseId} ya tiene un fixture asignado.`);
    this.name = 'InsufficientTeamsForFixtureError';
  }
}
