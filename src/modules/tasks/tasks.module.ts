import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';

import { TaskController } from './infrastructure/http/task.controller';

import { CreateTaskUseCase } from './application/create-task.use-case';
import { CompleteTaskUseCase } from './application/complete-task.use-case';
import { ListTasksUseCase } from './application/list-tasks.use-case';

import { InMemoryTaskRepository } from './infrastructure/persistence/in-memory-task.repository';
import { TaskRepositoryPort } from './domain/task.reporitory.port';
import { UserModuleLookupAdapter } from './infrastructure/adapters/user-module-lookup.adapter';
import { UserLookupPort } from './domain/user-lookup.port';
import {
  TASK_REPOSITORY,
  USER_LOOKUP,
  CREATE_TASK_USE_CASE,
  LIST_TASKS_USE_CASE,
  COMPLETE_TASK_USE_CASE,
} from './tasks.tokens';

@Module({
  imports: [UsersModule],
  controllers: [TaskController],
  providers: [
    {
      provide: TASK_REPOSITORY,
      useClass: InMemoryTaskRepository,
    },
    {
      // Nest instancia UserModuleLookupAdapter usando sus propios decoradores
      // (@Injectable/@Inject), porque es infraestructura, no un caso de uso.
      provide: USER_LOOKUP,
      useClass: UserModuleLookupAdapter,
    },
    {
      provide: CREATE_TASK_USE_CASE,
      useFactory: (
        taskRepository: TaskRepositoryPort,
        userLookup: UserLookupPort,
      ) => new CreateTaskUseCase(taskRepository, userLookup),
      inject: [TASK_REPOSITORY, USER_LOOKUP],
    },
    {
      provide: LIST_TASKS_USE_CASE,
      useFactory: (taskRepository: TaskRepositoryPort) =>
        new ListTasksUseCase(taskRepository),
      inject: [TASK_REPOSITORY],
    },
    {
      provide: COMPLETE_TASK_USE_CASE,
      useFactory: (taskRepository: TaskRepositoryPort) =>
        new CompleteTaskUseCase(taskRepository),
      inject: [TASK_REPOSITORY],
    },
  ],
})
export class TasksModule {}
