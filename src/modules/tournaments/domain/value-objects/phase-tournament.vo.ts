export class PhaseTournament {
  constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _status: string,
    private readonly _orderNumber: number,
    private readonly _tournamentId: string,
    private readonly _typeId: string,
  ) {}

  static create(
    id: string,
    name: string,
    status: string,
    orderNumber: number,
    tournamentId: string,
    typeId: string,
  ): PhaseTournament {
    return new PhaseTournament(
      id,
      name,
      status,
      orderNumber,
      tournamentId,
      typeId,
    );
  }

  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }
  get status() {
    return this._status;
  }
  get orderNumber() {
    return this._orderNumber;
  }
  get tournamentId() {
    return this._tournamentId;
  }
  get typeId() {
    return this._typeId;
  }
}
