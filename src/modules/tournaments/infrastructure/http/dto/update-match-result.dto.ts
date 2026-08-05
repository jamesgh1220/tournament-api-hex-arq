import { IsIn, IsInt, Min } from 'class-validator';
import { MatchResultStatus } from '../../../domain/enums/match-result-status.enum';

export class UpdateMatchResultDto {
  @IsInt()
  @Min(0)
  homeScore: number;

  @IsInt()
  @Min(0)
  awayScore: number;

  @IsIn(Object.values(MatchResultStatus))
  status: string;
}
