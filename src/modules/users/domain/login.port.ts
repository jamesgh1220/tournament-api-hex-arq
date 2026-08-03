import { User } from './user.entity';
import { TokenResponse } from './interfaces/token-response';

export interface UserPort {
  comparePassword(password: string, hashedPassword: string): Promise<boolean>;
  generateToken(payload: User): TokenResponse;
  hashPassword(password: string): Promise<string>;
}
