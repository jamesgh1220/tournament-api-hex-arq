import { GroupRepositoryPort } from '../domain/group.repository.port';
import { GroupNotFoundError } from '../domain/errors';

export class DeleteGroupUseCase {
  constructor(private readonly groupRepository: GroupRepositoryPort) {}

  async execute(id: string): Promise<void> {
    const group = await this.groupRepository.findById(id);
    if (!group) throw new GroupNotFoundError(id);

    await this.groupRepository.delete(id);
  }
}
