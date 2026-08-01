import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class StandingDto {
  @IsInt()
  @IsPositive()
  played: number;

  @IsInt()
  @IsPositive()
  wins: number;

  @IsInt()
  @IsPositive()
  draws: number;

  @IsInt()
  @IsPositive()
  losses: number;

  @IsOptional()
  @IsInt()
  goalsFor: number;

  @IsOptional()
  @IsInt()
  goalsAgainst: number;

  @IsOptional()
  @IsInt()
  points: number;

  @IsOptional()
  @IsInt()
  tournamentId: string;

  @IsOptional()
  @IsInt()
  phaseId: string;

  @IsOptional()
  @IsInt()
  groupId: string;

  @IsOptional()
  @IsInt()
  teamId: string;
}
