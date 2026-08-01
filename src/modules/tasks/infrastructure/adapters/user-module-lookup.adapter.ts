import { Inject, Injectable } from '@nestjs/common';
import { UserLookupPort } from '../../domain/user-lookup.port';
import { GetUserUseCase } from 'src/modules/users/application/get-user.use-case';
import { GET_USER_USE_CASE } from 'src/modules/users/user.tokens';
import { Assignee } from 'src/modules/tasks/domain/assignee.vo';
import { UserNotFoundError } from 'src/modules/users/domain/errors';

@Injectable()
export class UserModuleLookupAdapter implements UserLookupPort {
  constructor(
    @Inject(GET_USER_USE_CASE)
    private readonly getUserUseCase: GetUserUseCase,
  ) {}

  async getAssignee(userId: string): Promise<Assignee | null> {
    try {
      const user = await this.getUserUseCase.execute(userId);
      return Assignee.create(user.id, user.name, user.active);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return null;
      }
      throw error;
    }
  }
}
