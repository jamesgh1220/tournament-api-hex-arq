import { randomUUID } from 'crypto';
import { Standing } from '../standing.entity';
import { InitialStanding } from '../types/initial-standing';
import { StandingStats } from '../types/standing-stats';

export class StandingGenerator {
  initialStandingLeague(standings: InitialStanding[]): Standing[] {
    return standings.map((team) =>
      Standing.create(
        randomUUID(),
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        team.tournamentId,
        team.teamId,
        team.phaseId,
        team.groupId || null,
      ),
    );
  }

  calculateStandingAfterMatch(
    standing: Standing,
    stats: StandingStats,
  ): Standing {
    return new Standing(
      standing.id,
      standing.played + 1,
      standing.wins + stats.wins,
      standing.draws + stats.draws,
      standing.losses + stats.losses,
      standing.goalsFor + stats.goalsFor,
      standing.goalsAgainst + stats.goalsAgainst,
      standing.points + stats.points,
      standing.tournamentId,
      standing.teamId,
      standing.phaseId,
      standing.groupId,
    );
  }
}
