import { randomUUID } from 'crypto';
import { Standing } from '../standing.entity';
// TODO:
interface InitialStanding {
  tournamentId: string;
  phaseId: string;
  teamId: string;
  groupId?: string;
}

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
