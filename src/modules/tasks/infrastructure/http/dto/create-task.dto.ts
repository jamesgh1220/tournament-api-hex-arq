import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title: string;

  @IsUUID()
  assigneeId: string;
}
