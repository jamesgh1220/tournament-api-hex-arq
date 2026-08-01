export class Group {
  private constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _phaseId?: string | null,
  ) {}

  static create(id: string, name: string, phaseId?: string): Group {
    return new Group(id, name, phaseId ?? null);
  }

  static fromPersistence(props: {
    id: string;
    name: string;
    phaseId: string;
  }): Group {
    return new Group(props.id, props.name, props.phaseId);
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get phaseId(): string | null {
    return this._phaseId ?? null;
  }
}
