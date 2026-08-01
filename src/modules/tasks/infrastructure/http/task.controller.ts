import {
  Get,
  Body,
  Post,
  Param,
  Patch,
  Inject,
  Controller,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskUseCase } from '../../application/create-task.use-case';
import { ListTasksUseCase } from '../../application/list-tasks.use-case';
import { CompleteTaskUseCase } from '../../application/complete-task.use-case';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { InvalidAssigneeError, TaskNotFoundError } from '../../domain/errors';
import {
  CREATE_TASK_USE_CASE,
  LIST_TASKS_USE_CASE,
  COMPLETE_TASK_USE_CASE,
} from 'src/modules/tasks/tasks.tokens';

@Controller('tasks')
export class TaskController {
  constructor(
    @Inject(CREATE_TASK_USE_CASE)
    private readonly createTaskUseCase: CreateTaskUseCase,
    @Inject(LIST_TASKS_USE_CASE)
    private readonly listTasksUseCase: ListTasksUseCase,
    @Inject(COMPLETE_TASK_USE_CASE)
    private readonly completeTaskUseCase: CompleteTaskUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateTaskDto): Promise<TaskResponseDto> {
    try {
      const task = await this.createTaskUseCase.execute(
        dto.title,
        dto.assigneeId,
      );
      return TaskResponseDto.fromDomain(task);  
    } catch (error) {
      if (error instanceof InvalidAssigneeError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Get()
  async findAll(): Promise<TaskResponseDto[]> {
    const tasks = await this.listTasksUseCase.execute();
    return tasks.map(TaskResponseDto.fromDomain);
  }

  @Patch(':id/complete')
  async complete(@Param('id') id: string): Promise<TaskResponseDto> {
    try {
      const task = await this.completeTaskUseCase.execute(id);
      return TaskResponseDto.fromDomain(task);  
    } catch (error) {
      if (error instanceof TaskNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
