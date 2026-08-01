import { GroupRepositoryPort } from "../domain/group.repository.port";
import { Group } from "../domain/group.entity";
import { randomUUID } from "crypto";

export class CreateGroupUseCase {
  constructor(private readonly groupRepository: GroupRepositoryPort) {}

  async execute(name: string): Promise<Group> {
    const group = Group.create(randomUUID(), name);
    await this.groupRepository.create(group);

    return group;
  }
}
