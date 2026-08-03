import { PhaseType } from '../domain/phase-type.entity';
import { PhaseTypeRepositoryPort } from '../domain/phase-type.repository.port';

export class GetAllPhaseTypesUseCase {
  constructor(private readonly phaseTypeRepository: PhaseTypeRepositoryPort) {}

  async execute(): Promise<PhaseType[]> {
    return await this.phaseTypeRepository.findAll();
  }
}
