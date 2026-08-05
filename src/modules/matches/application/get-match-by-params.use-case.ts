import { MatchRepositoryPort } from '../domain/match.repository.port';
import { Match } from '../domain/match.entity';
import { MatchByParamsNotFoundError } from '../domain/errors';

export class GetMatchByParamsUseCase {
  constructor(private readonly matchRepository: MatchRepositoryPort) {}

  async execute(params: object): Promise<Match> {
    const match = await this.matchRepository.findByParams(params);
    if (!match) throw new MatchByParamsNotFoundError();

    return match;
  }
}
