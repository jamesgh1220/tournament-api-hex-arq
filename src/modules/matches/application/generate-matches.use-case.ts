import { MatchRepositoryPort } from '../domain/match.repository.port';
import { Match } from '../domain/match.entity';
import { FixtureGenerator } from '../domain/services/fixture-generator';

export class GenerateMatchesUseCase {
  constructor(
    private readonly matchRepository: MatchRepositoryPort,
    private readonly fixtureGenerator: FixtureGenerator,
  ) {}

  async execute(input: {
    phaseId: string;
    teamIds: string[];
    fixtureStartDate: Date;
    doubleRound?: boolean;
  }): Promise<Match[]> {
    const matches = this.fixtureGenerator.generate(input);
    await this.matchRepository.createMany(matches);
    return matches;
  }
}
