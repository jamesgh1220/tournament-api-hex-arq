import { PhaseTypeByNameNotFoundError } from "../domain/errors";
import { PhaseType } from "../domain/phase-type.entity";
import { PhaseTypeRepositoryPort } from "../domain/phase-type.repository.port";

export class GetPhaseTypeByNameUseCase {
  constructor(
    private readonly phaseTypeRepository: PhaseTypeRepositoryPort,
  ) {}

  async execute(name: string): Promise<PhaseType> {
    const type = await this.phaseTypeRepository.findByName(name);
    if (!type) throw new PhaseTypeByNameNotFoundError(name);

    return type;
  }
}
