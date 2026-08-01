import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchOrmEntity } from './infrastructure/persistence/match.orm';
import { MatchRepository } from './infrastructure/persistence/match.repository';
import { CreateMatchUseCase } from './application/create-match.use-case';
import { DeleteMatchUseCase } from './application/delete-match.use-case';
import { GetMatchUseCase } from './application/get-match.use-case';
import { GetAllMatchesUseCase } from './application/get-all-matches.use-cases';
import { MatchRepositoryPort } from './domain/match.repository.port';
import { GenerateMatchesUseCase } from './application/generate-matches.use-case';
import {
  MATCH_REPOSITORY,
  CREATE_MATCH_USE_CASE,
  DELETE_MATCH_USE_CASE,
  GET_MATCH_USE_CASE,
  GET_ALL_MATCHES_USE_CASE,
  GENERATE_MATCHES_USE_CASE,
} from './match.tokens';
import { MatchController } from './infrastructure/http/match.controller';
import { FixtureGenerator } from './domain/services/fixture-generator';

@Module({
  imports: [
    TypeOrmModule.forFeature([MatchOrmEntity]),
  ],
  providers: [
    FixtureGenerator,
    {
      provide: MATCH_REPOSITORY,
      useClass: MatchRepository,
    },
    {
      provide: CREATE_MATCH_USE_CASE,
      useFactory: (matchRepository: MatchRepositoryPort) =>
        new CreateMatchUseCase(matchRepository),
      inject: [MATCH_REPOSITORY]
    },
    {
      provide: DELETE_MATCH_USE_CASE,
      useFactory: (matchRepository: MatchRepositoryPort) =>
        new DeleteMatchUseCase(matchRepository),
      inject: [MATCH_REPOSITORY]
    },
    {
      provide: GET_MATCH_USE_CASE,
      useFactory: (matchRepository: MatchRepositoryPort) =>
        new GetMatchUseCase(matchRepository),
      inject: [MATCH_REPOSITORY]
    },
    {
      provide: GET_ALL_MATCHES_USE_CASE,
      useFactory: (matchRepository: MatchRepositoryPort) =>
        new GetAllMatchesUseCase(matchRepository),
      inject: [MATCH_REPOSITORY]
    },
    {
      provide: GENERATE_MATCHES_USE_CASE,
      useFactory: (
        matchRepository: MatchRepositoryPort,
        fixtureGenerator: FixtureGenerator,
      ) =>
        new GenerateMatchesUseCase(matchRepository, fixtureGenerator),
      inject: [MATCH_REPOSITORY, FixtureGenerator]
    },
  ],
  exports: [GENERATE_MATCHES_USE_CASE],
  controllers: [MatchController],
})
export class MatchesModule {}
