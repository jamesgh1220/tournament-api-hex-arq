export class InvalidAssigneeError extends Error {
  constructor(userId: string) {
    super(`El usuario ${userId} no existe o no está activo`);
    this.name = 'InvalidAssigneeError';
  }
}

export class TaskNotFoundError extends Error {
  constructor(id: string) {
    super(`Tarea con id ${id} no encontrada`);
    this.name = 'TaskNotFoundError';
  }
}
