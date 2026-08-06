import { MatchStatus } from './enums/match-status.enum';

export interface MatchUpdateData {
  phaseId?: string;
  homeTeamId?: string;
  awayTeamId?: string;
  homeScore?: number;
  awayScore?: number;
  status?: MatchStatus;
  scheduledAt?: Date;
  groupId?: string | null;
}

export class Match {
  constructor(
    private readonly _id: string,
    private readonly _phaseId: string,
    private readonly _homeTeamId: string,
    private readonly _awayTeamId: string,
    private readonly _homeScore: number,
    private readonly _awayScore: number,
    private readonly _status: MatchStatus,
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
    status: MatchStatus,
    scheduledAt: Date,
    groupId?: string | null,
  ): Match {
    if (homeScore < 0 || awayScore < 0) {
      throw new Error('Los goles no pueden ser negativos');
    }
    if (!Object.values(MatchStatus).includes(status)) {
      throw new Error('El estado del partido no es válido');
    }
    if (scheduledAt < new Date()) {
      throw new Error(
        'La fecha de inicio del partido no puede ser en el pasado',
      );
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
      props.status as MatchStatus,
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

  get status(): MatchStatus {
    return this._status;
  }

  get scheduledAt(): Date {
    return this._scheduledAt;
  }

  copyWith(data: MatchUpdateData): Match {
    const homeScore = data.homeScore ?? this._homeScore;
    const awayScore = data.awayScore ?? this._awayScore;
    const status = data.status ?? this._status;
    const scheduledAt = data.scheduledAt ?? this._scheduledAt;

    if (homeScore < 0 || awayScore < 0) {
      throw new Error('Los goles no pueden ser negativos');
    }
    if (!Object.values(MatchStatus).includes(status)) {
      throw new Error('El estado del partido no es válido');
    }
    if (data.scheduledAt !== undefined && data.scheduledAt < new Date()) {
      throw new Error(
        'La fecha de inicio del partido no puede ser en el pasado',
      );
    }

    return new Match(
      this._id,
      data.phaseId ?? this._phaseId,
      data.homeTeamId ?? this._homeTeamId,
      data.awayTeamId ?? this._awayTeamId,
      homeScore,
      awayScore,
      status,
      scheduledAt,
      data.groupId !== undefined ? data.groupId : this._groupId,
    );
  }
}
