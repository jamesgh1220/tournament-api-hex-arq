import { Inject } from '@nestjs/common';
import { UpdateMatchUseCase } from 'src/modules/matches/application/update-match.use-case';
import { GetMatchByParamsUseCase } from 'src/modules/matches/application/get-match-by-params.use-case';
import { MatchLookupPort } from '../../domain/ports/match-lookup.port';
import {
  GET_MATCH_BY_PARAMS_USE_CASE,
  UPDATE_MATCH_USE_CASE,
} from 'src/modules/matches/match.tokens';
import { MatchResult } from '../../domain/value-objects/match-result.vo';

export class MatchLookupAdapter implements MatchLookupPort {
  constructor(
    @Inject(GET_MATCH_BY_PARAMS_USE_CASE)
    private readonly getMatchByParamsUseCase: GetMatchByParamsUseCase,
    @Inject(UPDATE_MATCH_USE_CASE)
    private readonly updateMatchUseCase: UpdateMatchUseCase,
  ) {}

  // TODO: tipar respuesta
  async matchExists(matchId: string) {
    return await this.getMatchByParamsUseCase.execute({
      id: matchId,
    });
  }

  // TODO: tipar respuesta
  async update(matchId: string, result: MatchResult) {
    return await this.updateMatchUseCase.execute(matchId, {
      homeScore: result.homeScore,
      awayScore: result.awayScore,
      status: result.status,
    });
  }
}
