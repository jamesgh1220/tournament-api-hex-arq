import { MatchRepositoryPort } from '../domain/match.repository.port';
import { Match } from '../domain/match.entity';
import { MatchNotFoundError } from '../domain/errors';

export class GetMatchUseCase {
  constructor(private readonly matchRepository: MatchRepositoryPort) {}

  async execute(id: string): Promise<Match> {
    const match = await this.matchRepository.findById(id);
    if (!match) throw new MatchNotFoundError(id);

    return match;
  }
}
