import { PhaseRepositoryPort } from '../domain/phase.repository.port';
import { PhaseByIdNotFoundError } from '../domain/errors';

export class HasAssignedFixtureUseCase {
  constructor(private readonly phaseRepository: PhaseRepositoryPort) {}

  async execute(id: string): Promise<boolean> {
    const phaseWithMatches =
      await this.phaseRepository.hasAssignedFixturehasAssignedFixture(id);
    if (!phaseWithMatches) throw new PhaseByIdNotFoundError(id);

    return phaseWithMatches?.matches?.length > 0 || false;
  }
}
