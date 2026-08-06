import {
  IsDateString,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsIn,
} from 'class-validator';
import { MatchStatus } from '../../../domain/enums/match-status.enum';

export class MatchDto {
  @IsInt()
  phaseId: string;

  @IsOptional()
  @IsInt()
  groupId: string;

  @IsInt()
  homeTeamId: string;

  @IsInt()
  awayTeamId: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  homeScore: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  awayScore: number;

  @IsString()
  @IsIn(Object.values(MatchStatus))
  status: MatchStatus;

  @IsDateString()
  scheduledAt: string;
}
