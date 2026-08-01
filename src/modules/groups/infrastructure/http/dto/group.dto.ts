import { IsInt, IsPositive, IsString, IsNotEmpty } from 'class-validator';

export class GroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  // @IsInt()
  // @IsPositive()
  // phaseId: number;
}