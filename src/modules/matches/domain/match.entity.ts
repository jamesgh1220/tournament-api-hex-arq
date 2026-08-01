export class Match {
  constructor(
    private readonly _id: string,
    private readonly _phaseId: string,
    private readonly _homeTeamId: string,
    private readonly _awayTeamId: string,
    private readonly _homeScore: number,
    private readonly _awayScore: number,
    private readonly _status: string,
    private readonly _scheduledAt: Date,
    private readonly _groupId?: string | null,
  ) {}

  static create(
    id: string,
    phaseId: string,
    homeTeamId: string,
    awayTeamId: string,
    homeScore: number,
    awayScore: number,
    status: string,
    scheduledAt: Date,
    groupId?: string | null,
  ): Match {
    if (homeScore < 0 || awayScore < 0) {
      throw new Error('Los goles no pueden ser negativos');
    }
    if (status !== 'TO_COME' && status !== 'FINISHED') {
      throw new Error('El estado del partido no es válido');
    }
    if (scheduledAt < new Date()) {
      throw new Error('La fecha de inicio del partido no puede ser en el pasado');
    }

    return new Match(
      id,
      phaseId,
      homeTeamId,
      awayTeamId,
      homeScore,
      awayScore,
      status,
      scheduledAt,
      groupId,
    );
  }

  static fromPersistence(props: {
    id: string;
    phaseId: string;
    homeTeamId: string;
    awayTeamId: string;
    homeScore: number;
    awayScore: number;
    status: string;
    scheduledAt: Date;
    groupId?: string | null;
  }): Match {
    return new Match(
      props.id,
      props.phaseId,
      props.homeTeamId,
      props.awayTeamId,
      props.homeScore,
      props.awayScore,
      props.status,
      props.scheduledAt,
      props.groupId,
    );
  }

  get id(): string {
    return this._id;
  }

  get phaseId(): string {
    return this._phaseId;
  }

  get groupId(): string | null {
    return this._groupId ?? null;
  }

  get homeTeamId(): string {
    return this._homeTeamId;
  }

  get awayTeamId(): string {
    return this._awayTeamId;
  }

  get homeScore(): number {
    return this._homeScore;
  }

  get awayScore(): number {
    return this._awayScore;
  }

  get status(): string {
    return this._status;
  }

  get scheduledAt(): Date {
    return this._scheduledAt;
  }
}