import { Task } from '../domain/tasks.entity';
import { TaskRepositoryPort } from '../domain/task.reporitory.port';

export class ListTasksUseCase {
  constructor(private readonly taskRepository: TaskRepositoryPort) {}

  async execute(): Promise<Task[]> {
    return this.taskRepository.findAll();
  }
}
