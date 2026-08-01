import { Group } from "src/modules/groups/domain/group.entity";

export class GroupResponseDto {
  id: string;
  name: string;

  static fromDomain(group: Group): GroupResponseDto {
    const dto = new GroupResponseDto();
    dto.id = group.id;
    dto.name = group.name;
    return dto;
  }
}
