import { DomainError } from 'src/common/domain/domain-error';

export class GroupNotFoundError extends DomainError {
  readonly code = 'GROUP_NOT_FOUND';
  readonly statusCode = 404;

  constructor(id: string) {
    super(`Grupo con id ${id} no encontrado.`);
  }
}

export class GroupAlreadyExistsError extends DomainError {
  readonly code = 'GROUP_ALREADY_EXISTS';
  readonly statusCode = 409;

  constructor(name: string) {
    super(`Grupo con nombre ${name} ya existe.`);
  }
}

export class GroupInvalidNameError extends DomainError {
  readonly code = 'GROUP_INVALID_NAME';
  readonly statusCode = 400;

  constructor(name: string) {
    super(`El nombre ${name} del grupo es inválido.`);
  }
}

export class GroupByPhaseNotFoundError extends DomainError {
  readonly code = 'GROUP_BY_PHASE_NOT_FOUND';
  readonly statusCode = 404;

  constructor(phaseId: string) {
    super(`El grupo con la fase ${phaseId} no existe.`);
  }
}
