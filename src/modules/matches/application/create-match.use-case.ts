import { MatchRepositoryPort } from '../domain/match.repository.port';
import { Match } from '../domain/match.entity';
import { randomUUID } from 'crypto';

export class CreateMatchUseCase {
  constructor(private readonly matchRepository: MatchRepositoryPort) {}

  // async execute(phaseId: number, groupId: number, homeTeamId: string, awayTeamId: string, homeScore: number, awayScore: number, status: string, scheduledAt: Date): Promise<Match> {
  async execute(
    phaseId: string,
    homeTeamId: string,
    awayTeamId: string,
    homeScore: number,
    awayScore: number,
    status: string,
    scheduledAt: Date,
    groupId: string,
  ): Promise<Match> {
    const match = Match.create(
      randomUUID(),
      phaseId,
      homeTeamId,
      awayTeamId,
      homeScore,
      awayScore,
      status,
      scheduledAt,
      groupId,
    );
    await this.matchRepository.create(match);

    return match;
  }
}
