import { MatchResultStatus } from '../enums/match-result-status.enum';

export class MatchTournament {
  constructor(
    private readonly _id: string,
    private readonly _phaseId: string,
    private readonly _homeTeamId: string,
    private readonly _awayTeamId: string,
    private readonly _homeScore: number,
    private readonly _awayScore: number,
    private readonly _status: MatchResultStatus,
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
    status: MatchResultStatus,
    scheduledAt: Date,
    groupId?: string | null,
  ): MatchTournament {
    if (homeScore < 0 || awayScore < 0) {
      throw new Error('Los goles no pueden ser negativos');
    }
    if (!Object.values(MatchResultStatus).includes(status)) {
      throw new Error('El estado del partido no es válido');
    }
    if (scheduledAt < new Date()) {
      throw new Error(
        'La fecha de inicio del partido no puede ser en el pasado',
      );
    }

    return new MatchTournament(
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

  get status(): MatchResultStatus {
    return this._status;
  }

  get scheduledAt(): Date {
    return this._scheduledAt;
  }
}
