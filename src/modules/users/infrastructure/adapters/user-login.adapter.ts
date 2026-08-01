import { Injectable } from '@nestjs/common';
import { UserPort } from '../../domain/login.port';
import { User } from '../../domain/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TokenResponse } from '../../domain/interfaces/token-response';

@Injectable()
export class UserAdapter implements UserPort {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  generateToken(userData: User): TokenResponse {
    const payload = {
      sub: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return { accessToken, user: userData.toPublic() };
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}