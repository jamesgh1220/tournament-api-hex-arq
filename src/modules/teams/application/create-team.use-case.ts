import { Team } from '../domain/team.entity';
import { TeamRepositoryPort } from '../domain/team.repository.port';
import { randomUUID } from 'crypto';

export class CreateTeamUseCase {
  constructor(private readonly teamRepository: TeamRepositoryPort) {}

  async execute(name: string): Promise<Team> {
    const team = Team.create(randomUUID(), name);
    await this.teamRepository.create(team);

    return team;
  }
}
