import { StandingByTournamentNotFoundError } from '../domain/errors';
import { Standing } from '../domain/standing.entity';
import { StandingRepositoryPort } from '../domain/standing.repository.port';

export class GetStandingByTournamentUseCase {
  constructor(private readonly standingRepository: StandingRepositoryPort) {}

  async execute(tournamentId: string): Promise<Standing> {
    const standing =
      await this.standingRepository.findByTournament(tournamentId);
    if (!standing) throw new StandingByTournamentNotFoundError(tournamentId);

    return standing;
  }
}
