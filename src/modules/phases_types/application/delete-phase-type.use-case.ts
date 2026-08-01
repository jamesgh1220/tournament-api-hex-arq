import { PhaseTypeNotFoundError } from "../domain/errors";
import { PhaseTypeRepositoryPort } from "../domain/phase-type.repository.port";

export class DeletePhaseTypeUseCase {
  constructor(
    private readonly phaseTypeRepository: PhaseTypeRepositoryPort,
  ) {}

  async execute(id: string): Promise<void> {
    const type = await this.phaseTypeRepository.findById(id);
    if (!type) throw new PhaseTypeNotFoundError(id);

    return await this.phaseTypeRepository.delete(id);
  }
}
