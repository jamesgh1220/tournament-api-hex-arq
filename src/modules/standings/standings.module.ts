import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StandingOrmEntity } from './infrastructure/persistence/standing.orm';
import { CreateStandingUseCase } from './application/create-standing.use-case';
import { GetStandingByTournamentAndTeamUseCase } from './application/get-standing-by-tournament-and-team.use-case';
import { GetStandingByTournamentUseCase } from './application/get-standing-by-tournament.use-case';
import {
  STANDING_REPOSITORY,
  CREATE_STANDING_USE_CASE,
  GET_STANDING_BY_TOURNAMENT_USE_CASE,
  GET_STANDING_BY_TOURNAMENT_AND_TEAM_USE_CASE,
} from './standing.tokens';
import { StandingRepositoryPort } from './domain/standing.repository.port';
import { StandingRepository } from './infrastructure/persistence/standing.repository';
import { StandingController } from './infrastructure/http/standing.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([StandingOrmEntity]),
  ],
  providers: [
    {
      provide: STANDING_REPOSITORY,
      useClass: StandingRepository,
    },
    {
      provide: CREATE_STANDING_USE_CASE,
      useFactory: (standingRepository: StandingRepositoryPort) =>
        new CreateStandingUseCase(standingRepository),
      inject: [STANDING_REPOSITORY],
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
    }
  ],
  controllers: [StandingController],
})
export class StandingsModule {}
