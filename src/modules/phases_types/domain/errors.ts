export class PhaseTypeNotFoundError extends Error {
  constructor(id: string) {
    super(`Tipo de fase con id ${id} no encontrado`);
    this.name = 'PhaseTypeNotFoundError';
  }
}

export class PhaseTypeByNameNotFoundError extends Error {
  constructor(name: string) {
    super(`Tipo de fase con nombre ${name} no encontrado`);
    this.name = 'PhaseTypeByNameNotFoundError';
  }
}
