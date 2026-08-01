import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupOrmEntity } from './infrastructure/persistence/group.orm';
import { GroupRepository } from './infrastructure/persistence/group.repository';
import { GroupRepositoryPort } from './domain/group.repository.port';
import { CreateGroupUseCase } from './application/create-group.use-case';
import { GetGroupUseCase } from './application/get-group.use-case';
import { GetAllGroupsUseCase } from './application/get-all-groups.use-case';
import { DeleteGroupUseCase } from './application/delete-group.use-case';
import { GetGroupsByPhaseUseCase } from './application/get-groups-by-phase.use-case';
import {
  GROUP_REPOSITORY,
  CREATE_GROUP_USE_CASE,
  GET_GROUP_USE_CASE,
  GET_ALL_GROUPS_USE_CASE,
  DELETE_GROUP_USE_CASE,
  GET_GROUPS_BY_PHASE_USE_CASE,
} from './groups.tokens';
import { GroupController } from './infrastructure/http/group.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GroupOrmEntity])],
  providers: [
    {
      provide: GROUP_REPOSITORY,
      useClass: GroupRepository,
    },
    {
      provide: CREATE_GROUP_USE_CASE,
      useFactory: (groupRepository: GroupRepositoryPort) =>
        new CreateGroupUseCase(groupRepository),
      inject: [GROUP_REPOSITORY],
    },
    {
      provide: GET_GROUP_USE_CASE,
      useFactory: (groupRepository: GroupRepositoryPort) =>
        new GetGroupUseCase(groupRepository),
      inject: [GROUP_REPOSITORY],
    },
    {
      provide: GET_ALL_GROUPS_USE_CASE,
      useFactory: (groupRepository: GroupRepositoryPort) =>
        new GetAllGroupsUseCase(groupRepository),
      inject: [GROUP_REPOSITORY],
    },
    {
      provide: DELETE_GROUP_USE_CASE,
      useFactory: (groupRepository: GroupRepositoryPort) =>
        new DeleteGroupUseCase(groupRepository),
      inject: [GROUP_REPOSITORY],
    },
    {
      provide: GET_GROUPS_BY_PHASE_USE_CASE,
      useFactory: (groupRepository: GroupRepositoryPort) =>
        new GetGroupsByPhaseUseCase(groupRepository),
      inject: [GROUP_REPOSITORY],
    },
  ],
  controllers: [GroupController],
})
export class GroupsModule {}
