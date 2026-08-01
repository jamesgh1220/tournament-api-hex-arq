
import { randomUUID } from 'crypto';
import { Task } from "../domain/tasks.entity";
import { TaskRepositoryPort } from "../domain/task.reporitory.port";
import { UserLookupPort } from "../domain/user-lookup.port";
import { InvalidAssigneeError } from '../domain/errors';

export class CreateTaskUseCase {
  constructor(
    private readonly taskRepository: TaskRepositoryPort,
    private readonly userLookup: UserLookupPort,
  ) {}

  async execute(title: string, assigneeId: string): Promise<Task> {
    const assignee = await this.userLookup.getAssignee(assigneeId);
    if (!assignee || !assignee.active) {
      throw new InvalidAssigneeError(assigneeId);
    }

    const task = Task.create(randomUUID(), title, assigneeId, assignee);
    await this.taskRepository.save(task);
    return task;
  }
}
