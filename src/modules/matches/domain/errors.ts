import { DomainError } from 'src/common/domain/domain-error';

export class MatchNotFoundError extends DomainError {
  readonly code = 'MATCH_NOT_FOUND';
  readonly statusCode = 404;

  constructor(id: string) {
    super(`Partido con id ${id} no encontrado`);
  }
}
