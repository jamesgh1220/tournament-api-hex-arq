import { Inject } from '@nestjs/common';
import { PhaseTypePort } from '../../domain/ports/phase-type.port';
import { GET_PHASE_TYPE_BY_NAME_USE_CASE } from 'src/modules/phases_types/phases-types.tokens';
import { GetPhaseTypeByNameUseCase } from 'src/modules/phases_types/application/get-phase-type-by-name.use-case';
import { PhaseTypeByNameNotFoundError as PhaseTypeNameNotFound } from 'src/modules/phases_types/domain/errors';
import { PhaseTypeByNameNotFoundError } from '../../domain/errors';

export class PhaseTypeAdapter implements PhaseTypePort {
  constructor(
    @Inject(GET_PHASE_TYPE_BY_NAME_USE_CASE)
    private readonly getPhaseTypeByNameUseCase: GetPhaseTypeByNameUseCase,
  ) {}

  async findByName(name: string): Promise<{ id: string; name: string }> {
    try {
      const type = await this.getPhaseTypeByNameUseCase.execute(name);
      return {
        id: type?.id,
        name: type?.name,
      };
    } catch (error) {
      if (error instanceof PhaseTypeNameNotFound) {
        throw new PhaseTypeByNameNotFoundError(name);
      }
      throw error;
    }
  }
}
