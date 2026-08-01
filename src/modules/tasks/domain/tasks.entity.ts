import { Assignee } from "./assignee.vo";

export class Task {
  private constructor(
    private readonly _id: string,
    private _title: string,
    private _completed: boolean,
    private readonly _assigneeId: string,
    private readonly _assignee: Assignee,
    private readonly _createdAt: Date,
  ) {}

  static create(
    id: string,
    title: string,
    assigneeId: string,
    assignee: Assignee,
  ): Task {
    if (!title || title.trim().length === 0) {
      throw new Error('El título de la tarea no puede estar vacío');
    }

    if (!assigneeId) {
      throw new Error('La tarea debe tener un usuario asignado');
    }

    return new Task(
      id,
      title.trim(),
      false,
      assigneeId,
      assignee,
      new Date(),
    ); 
  }

  static fromPersistence(props: {
    id: string,
    title: string,
    completed: boolean,
    assigneeId: string,
    assignee: Assignee,
    createdAt: Date,
  }): Task {
    return new Task(
      props.id,
      props.title,
      props.completed,
      props.assigneeId,
      props.assignee,
      props.createdAt,
    );
  }

  complete(): void {
    if (this._completed) throw new Error('La tarea ya estaba completada');

    this._completed = true;
  }

  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get completed(): boolean {
    return this._completed;
  }

  get assigneeId(): string {
    return this._assigneeId;
  }

  get assignee(): Assignee {
    return this._assignee;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
