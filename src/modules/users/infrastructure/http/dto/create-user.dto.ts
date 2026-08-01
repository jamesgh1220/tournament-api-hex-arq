import { IsNotEmpty, IsString, MaxLength, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['team', 'admin'])
  role: string;
}
