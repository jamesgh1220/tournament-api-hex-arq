import { GroupRepositoryPort } from '../domain/group.repository.port';
import { Group } from '../domain/group.entity';

export class GetAllGroupsUseCase {
  constructor(private readonly groupRepository: GroupRepositoryPort) {}

  async execute(): Promise<Group[]> {
    return this.groupRepository.findAll();
  }
}
