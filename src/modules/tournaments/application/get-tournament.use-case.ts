import { TournamentRepositoryPort } from '../domain/tournament.repository.port';
import { Tournament } from '../domain/tournament.entity';
import { TournamentNotFoundError } from '../domain/errors';

export class GetTournamentUseCase {
  constructor(
    private readonly tournamentRepository: TournamentRepositoryPort,
  ) {}

  async execute(id: string): Promise<Tournament> {
    const tournament = await this.tournamentRepository.findById(id);
    if (!tournament) throw new TournamentNotFoundError(id);

    return tournament;
  }
}
