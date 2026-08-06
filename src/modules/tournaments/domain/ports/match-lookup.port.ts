import { MatchResult } from '../value-objects/match-result.vo';
import { MatchTournament } from '../value-objects/match-tournament.vo';

export interface MatchLookupPort {
  matchExists(matchId: string): Promise<MatchTournament>;
  update(matchId: string, result: MatchResult): Promise<MatchTournament>;
}
