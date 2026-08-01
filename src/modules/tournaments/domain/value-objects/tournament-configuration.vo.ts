import { TournamentType } from '../enums/tournament-type.enum';
import { InvalidTournamentTypeError } from '../errors';

export class TournamentConfiguration {
  private constructor(private readonly _type: TournamentType) {}

  static from(raw: Record<string, unknown>): TournamentConfiguration {
    const type = raw?.type;
    if (!Object.values(TournamentType).includes(type as TournamentType)) {
      throw new InvalidTournamentTypeError(String(type));
    }
    return new TournamentConfiguration(type as TournamentType);
  }

  get type(): TournamentType {
    return this._type;
  }

  shouldCreatePhaseAutomatically(): boolean {
    return this._type === TournamentType.LEAGUE;
  }
}
