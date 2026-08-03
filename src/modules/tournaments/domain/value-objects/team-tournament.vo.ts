export class TeamTournament {
  constructor(
    private readonly _id: string,
    private readonly _name: string,
  ) {}

  static create(id: string, name: string): TeamTournament {
    return new TeamTournament(id, name);
  }

  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }
}
