export class Standing {
  constructor(
    private readonly _id: string,
    private readonly _played: number,
    private readonly _wins: number,
    private readonly _draws: number,
    private readonly _losses: number,
    private readonly _goalsFor: number,
    private readonly _goalsAgainst: number,
    private readonly _points: number,
    private readonly _tournamentId: string,
    private readonly _teamId: string,
    private readonly _phaseId?: string,
    private readonly _groupId?: string | null,
  ) {}

  static create(
    id: string,
    played: number,
    wins: number,
    draws: number,
    losses: number,
    goalsFor: number,
    goalsAgainst: number,
    points: number,
    tournamentId: string,
    teamId: string,
    phaseId?: string,
    groupId?: string,
  ): Standing {
    if (played < 0) {
      throw new Error('Los partidos jugados deben ser mayor o igual a cero.');
    }

    if (wins < 0) {
      throw new Error(
        'La cantidad de partidos ganados debe ser mayor o igual a cero.',
      );
    }

    if (draws < 0) {
      throw new Error(
        'La cantidad de partidos empatados debe ser mayor o igual a cero.',
      );
    }

    if (losses < 0) {
      throw new Error(
        'La cantidad de partidos perdidos debe ser mayor o igual a cero.',
      );
    }

    if (goalsFor < 0) {
      throw new Error(
        'La cantidad de goles a favor debe ser mayor o igual a cero.',
      );
    }

    if (goalsAgainst < 0) {
      throw new Error(
        'La cantidad de goles en contra debe ser mayor o igual a cero.',
      );
    }

    if (points < 0) {
      throw new Error('La cantidad de puntos debe ser mayor o igual a cero.');
    }

    return new Standing(
      id,
      played,
      wins,
      draws,
      losses,
      goalsFor,
      goalsAgainst,
      points,
      tournamentId,
      teamId,
      phaseId,
      groupId,
    );
  }

  static fromPersistence(props: {
    id: string;
    played: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    points: number;
    tournamentId: string;
    teamId: string;
    phaseId?: string;
    groupId?: string | null;
  }) {
    return new Standing(
      props.id,
      props.played,
      props.wins,
      props.draws,
      props.losses,
      props.goalsFor,
      props.goalsAgainst,
      props.points,
      props.tournamentId,
      props.teamId,
      props.phaseId,
      props.groupId,
    );
  }

  get id(): string {
    return this._id;
  }

  get played(): number {
    return this._played;
  }

  get wins(): number {
    return this._wins;
  }

  get draws(): number {
    return this._draws;
  }

  get losses(): number {
    return this._losses;
  }

  get goalsFor(): number {
    return this._goalsFor;
  }

  get goalsAgainst(): number {
    return this._goalsAgainst;
  }

  get points(): number {
    return this._points;
  }

  get tournamentId(): string {
    return this._tournamentId;
  }

  get groupId(): string | null {
    return this._groupId ?? null;
  }

  get teamId(): string {
    return this._teamId;
  }
}
