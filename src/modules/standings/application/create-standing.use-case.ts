// import { randomUUID } from 'crypto';
import { StandingGenerator } from '../domain/service/standing-generator';
import { Standing } from '../domain/standing.entity';
import { StandingRepositoryPort } from '../domain/standing.repository.port';

// TODO:
interface InitialStanding {
  tournamentId: string;
  phaseId: string;
  teamId: string;
  groupId?: string;
}

export class CreateStandingUseCase {
  constructor(
    private readonly standingRepository: StandingRepositoryPort,
    private readonly standingGenerator: StandingGenerator,
  ) {}

  async execute(standings: InitialStanding[]): Promise<Standing[]> {
    // TODO: trycatch
    const initialStandings =
      this.standingGenerator.initialStandingLeague(standings);
    await this.standingRepository.createMany(initialStandings);

    return initialStandings;
  }
}
