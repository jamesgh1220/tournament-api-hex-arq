import { Task } from 'src/modules/tasks/domain/tasks.entity';
import { Assignee } from 'src/modules/tasks/domain/assignee.vo';

export class TaskResponseDto {
  id: string;
  title: string;
  completed: boolean;
  assigneeId: string;
  assignee: Assignee;
  createdAt: Date;

  static fromDomain(task: Task): TaskResponseDto {
    const dto = new TaskResponseDto();
    dto.id = task.id;
    dto.title = task.title;
    dto.completed = task.completed;
    dto.assigneeId = task.assigneeId;
    dto.assignee = task.assignee;
    dto.createdAt = task.createdAt;

    return dto;
  }
}
