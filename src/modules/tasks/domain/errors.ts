import { DomainError } from 'src/common/domain/domain-error';

export class InvalidAssigneeError extends DomainError {
  readonly code = 'INVALID_ASSIGNEE';
  readonly statusCode = 404;

  constructor(userId: string) {
    super(`El usuario ${userId} no existe o no está activo`);
  }
}

export class TaskNotFoundError extends DomainError {
  readonly code = 'TASK_NOT_FOUND';
  readonly statusCode = 404;

  constructor(id: string) {
    super(`Tarea con id ${id} no encontrada`);
  }
}
