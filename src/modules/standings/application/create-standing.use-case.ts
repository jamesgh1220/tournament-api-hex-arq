import { randomUUID } from 'crypto';
import { Standing } from '../domain/standing.entity';
import { StandingRepositoryPort } from '../domain/standing.repository.port';

export class CreateStandingUseCase {
  constructor(private readonly standingRepository: StandingRepositoryPort) {}

  async execute(
    played: number,
    wins: number,
    draws: number,
    losses: number,
    goalsFor: number,
    goalsAgainst: number,
    points: number,
    tournamentId: string,
    teamId: string,
    phaseId?: string,
    groupId?: string,
  ): Promise<Standing> {
    const standing = Standing.create(
      randomUUID(),
      played,
      wins,
      draws,
      losses,
      goalsFor,
      goalsAgainst,
      points,
      tournamentId,
      teamId,
      phaseId,
      groupId,
    );

    await this.standingRepository.create(standing);

    return standing;
  }
}
