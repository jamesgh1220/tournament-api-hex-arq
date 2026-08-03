import { Task } from '../domain/tasks.entity';
import { TaskRepositoryPort } from '../domain/task.reporitory.port';
import { TaskNotFoundError } from '../domain/errors';

export class CompleteTaskUseCase {
  constructor(private readonly taskRepository: TaskRepositoryPort) {}

  async execute(id: string): Promise<Task> {
    const task = await this.taskRepository.findById(id);
    if (!task) throw new TaskNotFoundError(id);

    task.complete();
    await this.taskRepository.save(task);
    return task;
  }
}
