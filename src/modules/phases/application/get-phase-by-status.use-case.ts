import { PhaseByStatusNotFoundError } from "../domain/errors";
import { Phase } from "../domain/phase.entity";
import { PhaseRepositoryPort } from "../domain/phase.repository.port";

export class GetPhaseByStatusUseCase {
  constructor(
    private readonly phaseRepository: PhaseRepositoryPort,
  ) {}

  async execute(tournamentId: string, status: string): Promise<Phase> {
    const phase = await this.phaseRepository.getByStatus(tournamentId, status);
    if (!phase) throw new PhaseByStatusNotFoundError(status);

    return phase;
  }
}
