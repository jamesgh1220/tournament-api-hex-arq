import { MatchRepositoryPort } from '../domain/match.repository.port';
import { MatchNotFoundError } from '../domain/errors';

export class DeleteMatchUseCase {
  constructor(private readonly matchRepository: MatchRepositoryPort) {}

  async execute(id: string): Promise<void> {
    const match = await this.matchRepository.findById(id);
    if (!match) throw new MatchNotFoundError(id);

    return await this.matchRepository.delete(id);
  }
}
