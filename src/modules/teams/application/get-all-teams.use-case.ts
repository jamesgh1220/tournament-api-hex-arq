import { Team } from "../domain/team.entity";
import { TeamRepositoryPort } from "../domain/team.repository.port";

export class GetAllTeamsUseCase {
  constructor(
    private readonly teamRepository: TeamRepositoryPort,
  ) {}

  async execute(): Promise<Team[]> {
    return this.teamRepository.findAll();
  }
}