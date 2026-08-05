import { DomainError } from 'src/common/domain/domain-error';

export class PhaseTypeNotFoundError extends DomainError {
  readonly code = 'PHASE_TYPE_NOT_FOUND';
  readonly statusCode = 404;

  constructor(id: string) {
    super(`Tipo de fase con id ${id} no encontrado`);
  }
}

export class PhaseTypeByNameNotFoundError extends DomainError {
  readonly code = 'PHASE_TYPE_BY_NAME_NOT_FOUND';
  readonly statusCode = 404;

  constructor(name: string) {
    super(`Tipo de fase con nombre ${name} no encontrado`);
  }
}
