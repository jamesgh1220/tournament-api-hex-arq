export class PhaseByIdNotFoundError extends Error {
  constructor(id: string) {
    super(`Fase con id ${id} no encontrada.`);
    this.name = 'PhaseByIdNotFoundError';
  }
}

export class PhaseByStatusNotFoundError extends Error {
  constructor(status: string) {
    super(`Fase con estado ${status} no encontrada.`);
    this.name = 'PhaseByStatusNotFoundError';
  }
}

export class PhaseByTournamentNotFoundError extends Error {
  constructor(tournamentId: string) {
    super(`Fase para el torneo con id ${tournamentId} no encontrada.`);
    this.name = 'PhaseByStatusNotFoundError';
  }
}
