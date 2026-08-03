import { Group } from '../domain/group.entity';
import { GroupRepositoryPort } from '../domain/group.repository.port';
import { GroupByPhaseNotFoundError } from '../domain/errors';

export class GetGroupsByPhaseUseCase {
  constructor(private readonly groupRepository: GroupRepositoryPort) {}

  async execute(phaseId: string): Promise<Group> {
    const group = await this.groupRepository.findByPhase(phaseId);
    if (!group) throw new GroupByPhaseNotFoundError(phaseId);

    return group;
  }
}
