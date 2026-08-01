import {
  IsDateString,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsIn,
} from 'class-validator';

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
  @IsIn(['TO_COME', 'FINISHED'])
  status: string;

  @IsDateString()
  scheduledAt: string;
}
