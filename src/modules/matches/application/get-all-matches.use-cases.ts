import { MatchRepositoryPort } from '../domain/match.repository.port';
import { Match } from '../domain/match.entity';

export class GetAllMatchesUseCase {
  constructor(private readonly matchRepository: MatchRepositoryPort) {}

  async execute(): Promise<Match[]> {
    return await this.matchRepository.findAll();
  }
}
