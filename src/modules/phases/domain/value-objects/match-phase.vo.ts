export class MatchPhase {
  constructor(
    private readonly _id: string,
    private readonly _phaseId: string,
    private readonly _homeTeamId: string,
    private readonly _awayTeamId: string,
    private readonly _homeScore: number,
    private readonly _awayScore: number,
    private readonly _status: string,
  ) {}

  static create(
    id: string,
    phaseId: string,
    homeTeamId: string,
    awayTeamId: string,
    homeScore: number,
    awayScore: number,
    status: string,
  ): MatchPhase {
    return new MatchPhase(
      id,
      phaseId,
      homeTeamId,
      awayTeamId,
      homeScore,
      awayScore,
      status,
    );
  }

  get id() { return this._id; }

  get phaseId() { return this._phaseId; }

  get homeTeamId() { return this._homeTeamId; }

  get awayTeamId() { return this._awayTeamId; }

  get homeScore() { return this._homeScore; }

  get awayScore() { return this._awayScore; }

  get status() { return this._status; }
}