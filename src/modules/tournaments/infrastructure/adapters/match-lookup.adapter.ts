import { Inject } from "@nestjs/common";
import { UpdateMatchUseCase } from "src/modules/matches/application/update-match.use-case";
import { GetMatchByParamsUseCase } from "src/modules/matches/application/get-match-by-params.use-case";
import { MatchLookupPort } from "../../domain/ports/match-lookup.port";
import { GET_MATCH_BY_PARAMS_USE_CASE, UPDATE_MATCH_USE_CASE } from "src/modules/matches/match.tokens";

// todo: generalizar
type UpdateMatch = {
  homeScore: number,
  awayScore: number,
  status: string,
};

export class MatchLookupAdapter implements MatchLookupPort {
  constructor(
    @Inject(GET_MATCH_BY_PARAMS_USE_CASE)
    private readonly getMatchByParamsUseCase: GetMatchByParamsUseCase,
    @Inject(UPDATE_MATCH_USE_CASE)
    private readonly updateMatchUseCase: UpdateMatchUseCase,
  ) {}

  // TODO: tipar respuesta
  async matchExists(matchId: string, phaseId: string) {
    return await this.getMatchByParamsUseCase.execute({
      id: matchId,
      phaseId,
    });
  }

  // TODO: tipar respuesta
  async update(matchId: string, data: UpdateMatch) {
    return await this.updateMatchUseCase.execute(matchId, data);
  }
}