import { MatchRepositoryPort } from '../domain/match.repository.port';
import { Match, MatchUpdateData } from '../domain/match.entity';
import { MatchNotFoundError } from '../domain/errors';

export class UpdateMatchUseCase {
  constructor(private readonly matchRepository: MatchRepositoryPort) {}

  async execute(id: string, data: MatchUpdateData): Promise<Match> {
    const match = await this.matchRepository.findById(id);
    if (!match) throw new MatchNotFoundError(id);

    const updated = match.copyWith(data);
    const saved = await this.matchRepository.update(updated);
    if (!saved) throw new MatchNotFoundError(id);

    return saved;
  }
}
