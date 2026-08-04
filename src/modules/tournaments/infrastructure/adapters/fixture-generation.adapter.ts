import { Inject } from '@nestjs/common';
import { GenerateMatchesUseCase } from 'src/modules/matches/application/generate-matches.use-case';
import { GENERATE_MATCHES_USE_CASE } from 'src/modules/matches/match.tokens';
import { FixtureGenerationPort } from '../../domain/ports/fixture-generation.port';
import { GenerateFixtureCommand } from '../../domain/ports/fixture-generation.port';
import { GeneratedMatchSummary } from '../../domain/ports/fixture-generation.port';

export class FixtureGenerationAdapter implements FixtureGenerationPort {
  constructor(
    @Inject(GENERATE_MATCHES_USE_CASE)
    private readonly generateMatchesUseCase: GenerateMatchesUseCase,
  ) {}

  async generateAndPersist(
    command: GenerateFixtureCommand,
  ): Promise<GeneratedMatchSummary[]> {
    const matches = await this.generateMatchesUseCase.execute(command);

    return matches.map((m) => ({
      id: m.id,
      phaseId: m.phaseId,
      homeTeamId: m.homeTeamId,
      awayTeamId: m.awayTeamId,
      scheduledAt: m.scheduledAt,
      groupId: m?.groupId || null,
    }));
  }
}
