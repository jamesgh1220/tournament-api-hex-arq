import { PublicUser } from 'src/modules/users/domain/interfaces/public-user';

export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;

  static fromDomain(user: PublicUser): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.name = user.name;
    dto.email = user.email;
    dto.role = user.role;
    dto.active = user.active;
    return dto;
  }
}
