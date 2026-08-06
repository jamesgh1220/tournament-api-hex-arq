import { MatchResult } from '../value-objects/match-result.vo';

export interface MatchLookupPort {
  matchExists(matchId: string): Promise<boolean>;
  // TODO: tipar respuesta
  update(matchId: string, result: MatchResult);
}
