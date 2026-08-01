import { Team } from "src/modules/teams/domain/team.entity";

export class TeamResponseDto {
  id: string;
  name: string;

  static fromDomain(team: Team): TeamResponseDto {
    const dto = new TeamResponseDto();
    dto.id = team.id;
    dto.name = team.name;
    return dto;
  }
}
