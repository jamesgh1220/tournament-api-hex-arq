import { MatchResult } from '../value-objects/match-result.vo';

export interface MatchLookupPort {
  // TODO: tipar respuesta
  matchExists(matchId: string, phaseId: string);
  // TODO: tipar respuesta
  update(matchId: string, result: MatchResult);
}
