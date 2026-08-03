import { TournamentRepositoryPort } from '../domain/tournament.repository.port';
import { Tournament } from '../domain/tournament.entity';

export class GetAllTournamentsUseCase {
  constructor(
    private readonly tournamentRepository: TournamentRepositoryPort,
  ) {}
  async execute(): Promise<Tournament[]> {
    return this.tournamentRepository.findAll();
  }
}
