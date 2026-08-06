import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { MatchStatus } from '../../../domain/enums/match-status.enum';

export class UpdateMatchDto {
  @IsOptional()
  @IsString()
  phaseId?: string;

  @IsOptional()
  @IsString()
  homeTeamId?: string;

  @IsOptional()
  @IsString()
  awayTeamId?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  homeScore?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  awayScore?: number;

  @IsOptional()
  @IsIn(Object.values(MatchStatus))
  status?: MatchStatus;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsString()
  groupId?: string;
}
