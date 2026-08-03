import { TeamRepositoryPort } from '../domain/team.repository.port';

export class DeleteTeamUseCase {
  constructor(private readonly teamRepository: TeamRepositoryPort) {}

  async execute(id: string): Promise<void> {
    await this.teamRepository.delete(id);
  }
}
