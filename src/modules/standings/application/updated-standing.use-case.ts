import { StandingNotFoundError } from '../domain/errors';
import { Standing, StandingUpdateData } from '../domain/standing.entity';
import { StandingRepositoryPort } from '../domain/standing.repository.port';

export class UpdatedStandingUseCase {
  constructor(private readonly standingRepository: StandingRepositoryPort) {}

  async execute(id: string, data: StandingUpdateData) {
    const standing = await this.standingRepository.findByParams({ id });
    if (!standing) throw new StandingNotFoundError(id);

    const updated = standing.copyWith(data);
    const saved = await this.standingRepository.update(updated);
    if (!saved) throw new StandingNotFoundError(id);

    return saved;
  }
}
