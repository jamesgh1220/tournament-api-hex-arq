import { MatchRepositoryPort } from '../domain/match.repository.port';
import { Match } from '../domain/match.entity';
import { MatchStatus } from '../domain/enums/match-status.enum';
import { randomUUID } from 'crypto';

export class CreateMatchUseCase {
  constructor(private readonly matchRepository: MatchRepositoryPort) {}

  async execute(
    phaseId: string,
    homeTeamId: string,
    awayTeamId: string,
    homeScore: number,
    awayScore: number,
    status: MatchStatus,
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
