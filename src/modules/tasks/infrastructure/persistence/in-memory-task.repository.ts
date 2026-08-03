import { Task } from '../../domain/tasks.entity';
import { TaskRepositoryPort } from '../../domain/task.reporitory.port';

export class InMemoryTaskRepository implements TaskRepositoryPort {
  private readonly tasks: Map<string, Task> = new Map();

  async save(task: Task): Promise<void> {
    this.tasks.set(task.id, task);
  }

  async findById(id: string): Promise<Task | null> {
    return this.tasks.get(id) ?? null;
  }

  async findAll(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }
}
