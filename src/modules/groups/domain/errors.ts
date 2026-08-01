export class GroupNotFoundError extends Error {
  constructor(id: string) {
    super(`Grupo con id ${id} no encontrado.`);
    this.name = 'GroupNotFoundError';
  }
}

export class GroupAlreadyExistsError extends Error {
  constructor(name: string) {
    super(`Grupo con nombre ${name} ya existe.`);
    this.name = 'GroupAlreadyExistsError';
  }
}

export class GroupInvalidNameError extends Error {
  constructor(name: string) {
    super(`El nombre ${name} del grupo es inválido.`);
    this.name = 'GroupInvalidNameError';
  }
}

export class GroupByPhaseNotFoundError extends Error {
  constructor(phaseId: string) {
    super(`El grupo con la fase ${phaseId} no existe.`);
    this.name = 'GroupByPhaseNotFoundError';
  }
}
