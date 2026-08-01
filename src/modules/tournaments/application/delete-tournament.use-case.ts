import { TournamentRepositoryPort } from "../domain/tournament.repository.port";
import { TournamentNotFoundError } from "../domain/errors";

export class DeleteTournamentUseCase {
  constructor(
    private readonly tournamentRepository: TournamentRepositoryPort,
  ) {}

  async execute(id: string): Promise<void> {
    const tournament = await this.tournamentRepository.findById(id);
    if (!tournament) throw new TournamentNotFoundError(id);
    return await this.tournamentRepository.delete(id);
  }
}
