import { Standing } from 'src/modules/standings/domain/standing.entity';

export class StandingResponseDto {
  id: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  tournamentId: string;
  teamId: string;
  phaseId?: string;
  groupId?: string | null;

  static fromDomain(standing: Standing): StandingResponseDto {
    const dto = new StandingResponseDto();
    dto.id = standing.id;
    dto.played = standing.played;
    dto.wins = standing.wins;
    dto.draws = standing.draws;
    dto.losses = standing.losses;
    dto.goalsFor = standing.goalsFor;
    dto.goalsAgainst = standing.goalsAgainst;
    dto.points = standing.points;
    dto.tournamentId = standing.tournamentId;
    dto.teamId = standing.teamId;
    // dto.phaseId = standing.phaseId;
    dto.groupId = standing.groupId;

    return dto;
  }
}
