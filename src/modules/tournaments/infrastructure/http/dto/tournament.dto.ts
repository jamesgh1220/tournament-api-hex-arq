import {
  IsString,
  IsIn,
  IsObject,
  IsNotEmpty,
  MinLength,
  IsDateString,
} from 'class-validator';

export class TournamentDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsIn(['TO_COME', 'IN_PROGRESS', 'FINISHED'])
  state: string;

  @IsNotEmpty()
  @IsObject()
  configuration: Record<string, any>;

  @IsDateString()
  startDate: Date;
}
