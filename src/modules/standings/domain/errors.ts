export class StandingByTournamentNotFoundError extends Error {
  constructor(id: string) {
    super(`Tabla de posiciones para el torneo con id ${id} no encontrado`)
    this.name = 'StandingByTournamentNotFoundError';
  }
}
