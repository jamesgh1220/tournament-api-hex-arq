import { User } from '../domain/user.entity';
import { UserRepositoryPort } from '../domain/user.repository.port';
import { UserNotFoundError } from '../domain/errors';

export class GetUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new UserNotFoundError(id);
    return user;
  }
}
