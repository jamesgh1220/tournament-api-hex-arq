import { DomainError } from 'src/common/domain/domain-error';

export class UserNotFoundError extends DomainError {
  readonly code = 'USER_NOT_FOUND';
  readonly statusCode = 404;

  constructor(id: string) {
    super(`Usuario con id ${id} no encontrado`);
  }
}
