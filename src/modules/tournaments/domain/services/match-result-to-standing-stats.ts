import { MatchResult } from '../value-objects/match-result.vo';
import { StandingStatsInput } from '../ports/standing-setup.port';

export type MatchSide = 'home' | 'away';

export function toStandingStats(
  result: MatchResult,
  side: MatchSide,
): StandingStatsInput {
  const goalsFor = side === 'home' ? result.homeScore : result.awayScore;
  const goalsAgainst = side === 'home' ? result.awayScore : result.homeScore;

  const wins = goalsFor > goalsAgainst ? 1 : 0;
  const draws = goalsFor === goalsAgainst ? 1 : 0;
  const losses = goalsFor < goalsAgainst ? 1 : 0;
  const points = wins ? 3 : draws ? 1 : 0;

  return { wins, draws, losses, goalsFor, goalsAgainst, points };
}
