export class Team {
  private constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _createdAt?: Date,
    private readonly _updatedAt?: Date,
  ) {}

  static create(id: string, name: string): Team {
    return new Team(id, name);
  }

  static fromPersistence(props: {
    id: string;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): Team {
    return new Team(props.id, props.name, props.createdAt, props.updatedAt);
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }
}
