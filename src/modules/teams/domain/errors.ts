import { DomainError } from 'src/common/domain/domain-error';

export class TeamNotFoundError extends DomainError {
  readonly code = 'TEAM_NOT_FOUND';
  readonly statusCode = 404;

  constructor(id: string) {
    super(`Equipo con id ${id} no encontrado`);
  }
}
