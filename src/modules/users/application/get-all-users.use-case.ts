import { UserRepositoryPort } from '../domain/user.repository.port';
import { User } from '../domain/user.entity';

export class GetAllUsersUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
