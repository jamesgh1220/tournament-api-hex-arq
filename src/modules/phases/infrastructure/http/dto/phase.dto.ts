import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsIn,
  IsInt,
  Min,
  IsPositive,
} from 'class-validator';

export class PhaseDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsIn(['TO_COME', 'IN_PROGRESS', 'FINISHED'])
  status: string;

  @IsInt()
  @Min(1)
  @IsPositive()
  orderNumber: number;

  @IsInt()
  @IsPositive()
  tournamentId: string;

  @IsInt()
  @IsPositive()
  typeId: string;
}
