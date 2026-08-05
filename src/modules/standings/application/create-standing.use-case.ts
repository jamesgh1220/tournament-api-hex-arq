import { StandingGenerator } from '../domain/service/standing-generator';
import { Standing } from '../domain/standing.entity';
import { StandingRepositoryPort } from '../domain/standing.repository.port';
import { InitialStanding } from '../domain/types/initial-standing';

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
