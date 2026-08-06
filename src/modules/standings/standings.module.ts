import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StandingOrmEntity } from './infrastructure/persistence/standing.orm';
import { CreateStandingUseCase } from './application/create-standing.use-case';
import { GetStandingByTournamentAndTeamUseCase } from './application/get-standing-by-tournament-and-team.use-case';
import { GetStandingByTournamentUseCase } from './application/get-standing-by-tournament.use-case';
import { GetStandingByPhaseTournamentUseCase } from './application/get-standing-by-phase-tournament.use-case';
import {
  STANDING_REPOSITORY,
  CREATE_STANDING_USE_CASE,
  GET_STANDING_BY_TOURNAMENT_USE_CASE,
  GET_STANDING_BY_PHASE_TOURNAMENT_USE_CASE,
  GET_STANDING_BY_TOURNAMENT_AND_TEAM_USE_CASE,
  UPDATE_STANDING_AFTER_MATCH_USE_CASE,
} from './standing.tokens';
import { StandingRepositoryPort } from './domain/standing.repository.port';
import { StandingRepository } from './infrastructure/persistence/standing.repository';
import { StandingController } from './infrastructure/http/standing.controller';
import { StandingGenerator } from './domain/service/standing-generator';
import { UpdateStandingAfterMatchUseCase } from './application/update-standing-after-match.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([StandingOrmEntity])],
  providers: [
    StandingGenerator,
    {
      provide: STANDING_REPOSITORY,
      useClass: StandingRepository,
    },
    {
      provide: CREATE_STANDING_USE_CASE,
      useFactory: (
        standingRepository: StandingRepositoryPort,
        standingGenerator: StandingGenerator,
      ) => new CreateStandingUseCase(standingRepository, standingGenerator),
      inject: [STANDING_REPOSITORY, StandingGenerator],
    },
    {
      provide: GET_STANDING_BY_TOURNAMENT_USE_CASE,
      useFactory: (standingRepository: StandingRepositoryPort) =>
        new GetStandingByTournamentUseCase(standingRepository),
      inject: [STANDING_REPOSITORY],
    },
    {
      provide: GET_STANDING_BY_TOURNAMENT_AND_TEAM_USE_CASE,
      useFactory: (standingRepository: StandingRepositoryPort) =>
        new GetStandingByTournamentAndTeamUseCase(standingRepository),
      inject: [STANDING_REPOSITORY],
    },
    {
      provide: GET_STANDING_BY_PHASE_TOURNAMENT_USE_CASE,
      useFactory: (standingRepository: StandingRepositoryPort) =>
        new GetStandingByPhaseTournamentUseCase(standingRepository),
      inject: [STANDING_REPOSITORY],
    },
    {
      provide: UPDATE_STANDING_AFTER_MATCH_USE_CASE,
      useFactory: (
        standingRepository: StandingRepositoryPort,
        standingGenerator: StandingGenerator,
      ) =>
        new UpdateStandingAfterMatchUseCase(
          standingRepository,
          standingGenerator,
        ),
      inject: [STANDING_REPOSITORY, StandingGenerator],
    },
  ],
  exports: [
    CREATE_STANDING_USE_CASE,
    GET_STANDING_BY_PHASE_TOURNAMENT_USE_CASE,
    UPDATE_STANDING_AFTER_MATCH_USE_CASE,
  ],
  controllers: [StandingController],
})
export class StandingsModule {}
