import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class PhaseTypeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}
