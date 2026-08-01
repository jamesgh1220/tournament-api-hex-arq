import { randomUUID } from 'crypto';
import { User } from '../domain/user.entity';
import { UserRepositoryPort } from '../domain/user.repository.port';
import { UserPort } from '../domain/login.port';

export class CreateUserUseCase {
  constructor(
    private readonly userAdapter: UserPort,
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(name: string, email: string, password: string, role: string): Promise<User> {
    const exists = await this.userRepository.findByEmail(email);
    if (exists) {
      throw new Error('El email ya está en uso');
    }

    const hashedPassword = await this.userAdapter.hashPassword(password);

    const user = User.create(randomUUID(), name, email, hashedPassword, role);
    await this.userRepository.save(user);

    return user;
  }
}
