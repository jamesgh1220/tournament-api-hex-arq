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

  // generateUpdateStanding(standing: Standing): Standing {

  // }

  // TODO: tipar respuesta
  calculateStandingAfterMatch(standing: Standing, stats: StandingStats) {
    return {
      _played: standing.played + 1,
      _wins: standing.wins + stats.wins,
      _draws: standing.draws + stats.draws,
      _losses: standing.losses + stats.losses,
      _goalsFor: standing.goalsFor + stats.goalsFor,
      _goalsAgainst: standing.goalsAgainst + stats.goalsAgainst,
      _points: standing.points + stats.points,
    };
  }
}
