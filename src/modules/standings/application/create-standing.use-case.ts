import { StandingPersistenceError } from '../domain/errors';
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
    const initialStandings =
      this.standingGenerator.initialStandingLeague(standings);
    const savedStandings =
      await this.standingRepository.createMany(initialStandings);

    if (!initialStandings || !savedStandings)
      throw new StandingPersistenceError();

    return initialStandings;
  }
}
