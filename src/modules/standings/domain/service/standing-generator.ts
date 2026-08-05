import { randomUUID } from 'crypto';
import { Standing } from '../standing.entity';
import { InitialStanding } from '../types/initial-standing';

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
}
