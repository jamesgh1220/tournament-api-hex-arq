import { randomUUID } from 'crypto';
import { Phase } from '../domain/phase.entity';
import { PhaseRepositoryPort } from '../domain/phase.repository.port';

export class CreatePhaseUseCase {
  constructor(private readonly phaseRepository: PhaseRepositoryPort) {}

  async execute(
    name: string,
    status: string,
    orderNumber: number,
    tournamentId: string,
    typeId: string,
  ): Promise<Phase> {
    const phase = Phase.create(
      randomUUID(),
      name,
      status,
      orderNumber,
      tournamentId,
      typeId,
    );

    await this.phaseRepository.create(phase);

    return phase;
  }
}
