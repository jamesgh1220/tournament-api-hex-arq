import { Match } from "src/modules/matches/domain/match.entity";

export class MatchResponseDto {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  status: string;
  scheduledAt: Date;

  static fromDomain(match: Match): MatchResponseDto {
    const dto = new MatchResponseDto();
    dto.id = match.id;
    dto.homeTeamId = match.homeTeamId;
    dto.awayTeamId = match.awayTeamId;
    dto.homeScore = match.homeScore;
    dto.awayScore = match.awayScore;
    dto.status = match.status;
    dto.scheduledAt = match.scheduledAt;
    return dto;
  }
}
