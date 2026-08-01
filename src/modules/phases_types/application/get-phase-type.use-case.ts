import { PhaseTypeNotFoundError } from "../domain/errors";
import { PhaseType } from "../domain/phase-type.entity";
import { PhaseTypeRepositoryPort } from "../domain/phase-type.repository.port";

export class GetPhaseTypeUseCase {
  constructor(
    private readonly phaseTypeRepository: PhaseTypeRepositoryPort,
  ) {}

  async execute(typeId: string): Promise<PhaseType> {
    const type = await this.phaseTypeRepository.findById(typeId);
    if (!type) throw new PhaseTypeNotFoundError(typeId);

    return type;
  }
}
