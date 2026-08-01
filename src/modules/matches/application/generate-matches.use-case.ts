import { MatchRepositoryPort } from "../domain/match.repository.port";
import { FixtureGenerator } from "../domain/services/fixture-generator";

//TODO: llevar a types generales de dominio
export type GeneratedMatchSummary = {
  id: string;
  phaseId: string;
  homeTeamId: string;
  awayTeamId: string;
  scheduledAt: Date;
  groupId: string | null;
};

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
  }): Promise<GeneratedMatchSummary[]> {
    const matches = this.fixtureGenerator.generate(input);
    await this.matchRepository.createMany(matches);
    return matches;
  }
}