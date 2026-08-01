import { UserRepositoryPort } from '../domain/user.repository.port';
import { LoginDto } from '../infrastructure/http/dto/login.dto';
import { UserPort } from '../domain/login.port';
import { TokenResponse } from '../domain/interfaces/token-response';

export class LoginUserUseCase {
  constructor(
    private readonly loginAdapter: UserPort,
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(dto: LoginDto): Promise<TokenResponse> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const isValidPassword = await this.loginAdapter.comparePassword(dto.password, user.password);
    if (!isValidPassword) {
      throw new Error('Credenciales inválidas');
    }

    const tokenResponse = this.loginAdapter.generateToken(user);

    return { accessToken: tokenResponse.accessToken, user: tokenResponse.user };
  }
}