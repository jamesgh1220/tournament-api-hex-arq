import { MatchResultStatus } from '../enums/match-result-status.enum';
import {
  InvalidMatchScoreError,
  InvalidMatchStatusError,
} from '../errors';

export class MatchResult {
  private constructor(
    private readonly _homeScore: number,
    private readonly _awayScore: number,
    private readonly _status: MatchResultStatus,
  ) {}

  static create(
    homeScore: number,
    awayScore: number,
    status: string,
  ): MatchResult {
    if (!Number.isInteger(homeScore) || !Number.isInteger(awayScore)) {
      throw new InvalidMatchScoreError();
    }
    if (homeScore < 0 || awayScore < 0) {
      throw new InvalidMatchScoreError();
    }
    if (
      !Object.values(MatchResultStatus).includes(status as MatchResultStatus)
    ) {
      throw new InvalidMatchStatusError(status);
    }

    return new MatchResult(
      homeScore,
      awayScore,
      status as MatchResultStatus,
    );
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
}
