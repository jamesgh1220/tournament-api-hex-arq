export class MatchNotFoundError extends Error {
  constructor(id: string) {
    super(`Partido con id ${id} no encontrado`);
    this.name = 'MatchNotFoundError';
  }
}
