import { MatchPhase } from "./value-objects/match-phase.vo";

export class Phase {
  constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _status: string,
    private readonly _orderNumber: number,
    private readonly _tournamentId: string,
    private readonly _typeId: string,
    private readonly _matches: MatchPhase[] = [],
  ) {}

  static create(
    id: string,
    name: string,
    status: string,
    orderNumber: number,
    tournamentId: string,
    typeId: string,
  ): Phase {
    if (!name || name.trim().length === 0) {
      throw new Error('El nombre de la fase no puede estar vacío.');
    }

    if (!status || status.trim().length === 0) {
      throw new Error('El nombre de la fase no puede estar vacío.');
    }

    if (orderNumber <= 0) {
      throw new Error('El orden debe ser mayor que cero.');
    }

    return new Phase(
      id,
      name,
      status,
      orderNumber,
      tournamentId,
      typeId,
    );
  }

  static fromPersistence(props: {
    id: string,
    name: string,
    status: string,
    orderNumber: number,
    tournamentId: string,
    typeId: string,
    matches: MatchPhase[],
  }): Phase {
    return new Phase(
      props.id,
      props.name,
      props.status,
      props.orderNumber,
      props.tournamentId,
      props.typeId,
      props.matches,
    );
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get status(): string {
    return this._status;
  }

  get orderNumber(): number {
    return this._orderNumber;
  }

  get tournamentId(): string {
    return this._tournamentId;
  }

  get typeId(): string {
    return this._typeId;
  }

  get matches(): MatchPhase[] {
    return this._matches;
  }

  hasAssignedFixture(): boolean {
    return this._matches?.length > 0;
  }
}
