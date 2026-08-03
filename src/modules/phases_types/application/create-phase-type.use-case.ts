import { randomUUID } from 'crypto';
import { PhaseType } from '../domain/phase-type.entity';
import { PhaseTypeRepositoryPort } from '../domain/phase-type.repository.port';

export class CreatePhaseTypeUseCase {
  constructor(private readonly phaseTypeRepository: PhaseTypeRepositoryPort) {}

  async execute(name: string): Promise<PhaseType> {
    const type = PhaseType.create(randomUUID(), name);
    await this.phaseTypeRepository.create(type);

    return type;
  }
}
