import { Standing } from '../domain/standing.entity';
import { StandingRepositoryPort } from '../domain/standing.repository.port';
import { StandingByTournamentNotFoundError } from '../domain/errors';

export class GetStandingByPhaseTournamentUseCase {
  constructor(private readonly standingRepository: StandingRepositoryPort) {}

  async execute(tournamentId: string, phaseId: string): Promise<Standing> {
    const standing = await this.standingRepository.findByPhaseTournament(
      tournamentId,
      phaseId,
    );
    if (!standing) throw new StandingByTournamentNotFoundError(tournamentId);

    return standing;
  }
}