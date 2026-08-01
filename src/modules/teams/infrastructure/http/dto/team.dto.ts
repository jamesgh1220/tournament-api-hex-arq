import { IsString, MinLength } from 'class-validator';

export class TeamDto {
  @IsString()
  @MinLength(2)
  name: string;
}
