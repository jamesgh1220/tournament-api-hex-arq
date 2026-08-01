export class Assignee {
  private constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _active: boolean,
  ) {}

  static create(id: string, name: string, active: boolean): Assignee {
    if (!id) throw new Error('Id del encargado es requerido');
    if (!name?.trim()) throw new Error('El nombre del encargado es requerido');
    return new Assignee(id, name.trim(), active);
  }

  get id() { return this._id; }
  get name() { return this._name; }
  get active() { return this._active; }
}
