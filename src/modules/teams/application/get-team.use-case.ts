import { Team } from "../domain/team.entity";
import { TeamRepositoryPort } from "../domain/team.repository.port";
import { TeamNotFoundError } from "../domain/errors";

export class GetTeamUseCase {
  constructor(
    private readonly teamRepository: TeamRepositoryPort,
  ) {}

  async execute(id: string): Promise<Team> {
    const team = await this.teamRepository.findById(id);
    if (!team) throw new TeamNotFoundError(id);
    return team;
  }
}
