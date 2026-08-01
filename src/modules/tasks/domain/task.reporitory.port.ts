import { Task } from "./tasks.entity";

export interface TaskRepositoryPort {
  save(task: Task): Promise<void>;
  findById(id: string): Promise<Task | null>;
  findAll(): Promise<Task[]>;
}
