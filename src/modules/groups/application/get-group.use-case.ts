import { GroupRepositoryPort } from "../domain/group.repository.port";
import { Group } from "../domain/group.entity";
import { GroupNotFoundError } from "../domain/errors";

export class GetGroupUseCase {
  constructor(private readonly groupRepository: GroupRepositoryPort) {}

  async execute(id: string): Promise<Group> {
    const group = await this.groupRepository.findById(id);
    if (!group) throw new GroupNotFoundError(id);

    return group;
  }
}
