import { PhaseByTournamentNotFoundError } from '../domain/errors';
import { Phase } from '../domain/phase.entity';
import { PhaseRepositoryPort } from '../domain/phase.repository.port';

export class GetPhaseByTournamentUseCase {
  constructor(private readonly phaseRepository: PhaseRepositoryPort) {}

  async execute(tournamentId: string): Promise<Phase> {
    const phase = await this.phaseRepository.getByTournament(tournamentId);
    if (!phase) throw new PhaseByTournamentNotFoundError(tournamentId);

    return phase;
  }
}
