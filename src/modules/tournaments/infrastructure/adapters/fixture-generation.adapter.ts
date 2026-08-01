import { Inject } from "@nestjs/common";
import { GenerateMatchesUseCase } from "src/modules/matches/application/generate-matches.use-case";
import { GENERATE_MATCHES_USE_CASE } from "src/modules/matches/match.tokens";
import { FixtureGenerationPort } from "../../domain/ports/fixture-generation.port";
import { GenerateFixtureCommand } from "../../domain/ports/fixture-generation.port";

//TODO: llevar a types generales de dominio
export type GeneratedMatchSummary = {
  id: string;
  phaseId: string;
  homeTeamId: string;
  awayTeamId: string;
  scheduledAt: Date;
  groupId: string | null;
};

export class FixtureGenerationAdapter implements FixtureGenerationPort {
  constructor(
    @Inject(GENERATE_MATCHES_USE_CASE)
    private readonly generateMatchesUseCase: GenerateMatchesUseCase,
  ) {}

  // TODO: Tipar la respuesta
  async generateAndPersist(command: GenerateFixtureCommand): Promise<GeneratedMatchSummary[]> {
    const matches = await this.generateMatchesUseCase.execute(command);

    // TODO: Devolver de forma tipada
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