import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamOrmEntity } from './infrastructure/persistence/team.orm';
import {
  TEAM_REPOSITORY,
  CREATE_TEAM_USE_CASE,
  GET_ALL_TEAMS_USE_CASE,
  GET_TEAM_USE_CASE,
  UPDATE_TEAM_USE_CASE,
  DELETE_TEAM_USE_CASE,
} from './teams.tokens';
import { GetAllTeamsUseCase } from './application/get-all-teams.use-case';
import { GetTeamUseCase } from './application/get-team.use-case';
import { DeleteTeamUseCase } from './application/delete-team.use-case';
import { CreateTeamUseCase } from './application/create-team.use-case';
import { TeamRepository } from './infrastructure/persistence/team.repository';
import { TeamController } from './infrastructure/http/team.controller';
import { TeamRepositoryPort } from './domain/team.repository.port';

@Module({
  imports: [TypeOrmModule.forFeature([TeamOrmEntity])],
  providers: [
    {
      provide: TEAM_REPOSITORY,
      useClass: TeamRepository,
    },
    {
      provide: CREATE_TEAM_USE_CASE,
      useFactory: (teamRepository: TeamRepositoryPort) =>
        new CreateTeamUseCase(teamRepository),
      inject: [TEAM_REPOSITORY],
    },
    {
      provide: GET_ALL_TEAMS_USE_CASE,
      useFactory: (teamRepository: TeamRepositoryPort) =>
        new GetAllTeamsUseCase(teamRepository),
      inject: [TEAM_REPOSITORY],
    },
    {
      provide: GET_TEAM_USE_CASE,
      useFactory: (teamRepository: TeamRepositoryPort) =>
        new GetTeamUseCase(teamRepository),
      inject: [TEAM_REPOSITORY],
    },
    {
      provide: DELETE_TEAM_USE_CASE,
      useFactory: (teamRepository: TeamRepositoryPort) =>
        new DeleteTeamUseCase(teamRepository),
      inject: [TEAM_REPOSITORY],
    },
  ],
  exports: [GET_TEAM_USE_CASE],
  controllers: [TeamController],
})
export class TeamsModule {}
