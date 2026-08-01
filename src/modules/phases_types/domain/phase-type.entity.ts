export class PhaseType {
  constructor(
    private readonly _id: string,
    private readonly _name: string,
  ) {}

  static create(id: string, name: string): PhaseType {
    return new PhaseType(id, name);
  }

  static fromPersistence(props: { id: string, name: string }): PhaseType {
    return new PhaseType(props.id, props.name);
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }
}
