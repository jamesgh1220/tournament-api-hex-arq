import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TournamentOrmEntity } from './infrastructure/persistence/tournament.orm';
import { TOURNAMENT_REPOSITORY } from './tournament.tokens';
import { TournamentRepository } from './infrastructure/persistence/tournament.repository';
import { CreateTournamentUseCase } from './application/create-tournament.use-case';
import { GetAllTournamentsUseCase } from './application/get-all-tournaments.use-case';
import { GetTournamentUseCase } from './application/get-tournament.use-case';
import { DeleteTournamentUseCase } from './application/delete-tournament.use-case';
import { AddTeamToTournamentUseCase } from './application/add-team-to-tournament.use-case';
import { RemoveTeamFromTournamentUseCase } from './application/remove-team-from-tournament.use-case';
import { GenerateFixtureUseCase } from './application/generate-fixture.use-case';
import {
  CREATE_TOURNAMENT_USE_CASE,
  GET_ALL_TOURNAMENTS_USE_CASE,
  GET_TOURNAMENT_USE_CASE,
  DELETE_TOURNAMENT_USE_CASE,
  ADD_TEAM_TO_TOURNAMENT_USE_CASE,
  REMOVE_TEAM_FROM_TOURNAMENT_USE_CASE,
  GENERATE_FIXTURE_TOURNAMENT_USE_CASE,
  TEAM_LOOKUP,
  PHASE_SETUP,
  PHASE_LOOKUP,
  PHASE_TYPE_PORT,
  FIXTURE_GENERATE_PORT,
  STANDING_SETUP_PORT,
} from './tournament.tokens';
import { UNIT_OF_WORK } from 'src/shared/shared.tokens';
import { TournamentRepositoryPort } from './domain/tournament.repository.port';
import { TournamentController } from './infrastructure/http/tournament.controller';
import { TeamLookupPort } from './domain/ports/team-lookup.port';
import { TeamLookupAdapter } from './infrastructure/adapters/team-lookup.adapter';
import { TeamsModule } from '../teams/teams.module';
import { PhaseSetupPort } from './domain/ports/phase-setup.port';
import { PhaseTypePort } from './domain/ports/phase-type.port';
import { PhaseSetupAdapter } from './infrastructure/adapters/phase-setup.adapter';
import { PhaseTypeAdapter } from './infrastructure/adapters/phase-type.adapter';
import { PhasesTypesModule } from '../phases_types/phases_types.module';
import { PhasesModule } from '../phases/phases.module';
import { PhaseLookupPort } from './domain/ports/phase-lookup.port';
import { PhaseLookupAdapter } from './infrastructure/adapters/phase-lookup.adapter';
import { FixtureGenerationPort } from './domain/ports/fixture-generation.port';
import { FixtureGenerationAdapter } from './infrastructure/adapters/fixture-generation.adapter';
import { MatchesModule } from '../matches/matches.module';
import { UnitOfWorkPort } from 'src/shared/application/ports/unit-of-work.port';
import { StandingSetupPort } from './domain/ports/standing-setup.port';
import { StandingSetupAdapter } from './infrastructure/adapters/standing-setup.adapter';

@Module({
  imports: [
    TypeOrmModule.forFeature([TournamentOrmEntity]),
    TeamsModule,
    PhasesModule,
    PhasesTypesModule,
    MatchesModule,
  ],
  providers: [
    {
      provide: TOURNAMENT_REPOSITORY,
      useClass: TournamentRepository,
    },
    {
      provide: STANDING_SETUP_PORT,
      useClass: StandingSetupAdapter,
    },
    {
      provide: TEAM_LOOKUP,
      useClass: TeamLookupAdapter,
    },
    {
      provide: PHASE_SETUP,
      useClass: PhaseSetupAdapter,
    },
    {
      provide: PHASE_TYPE_PORT,
      useClass: PhaseTypeAdapter,
    },
    {
      provide: PHASE_LOOKUP,
      useClass: PhaseLookupAdapter,
    },
    {
      provide: FIXTURE_GENERATE_PORT,
      useClass: FixtureGenerationAdapter,
    },
    {
      provide: CREATE_TOURNAMENT_USE_CASE,
      useFactory: (
        userRepository: TournamentRepositoryPort,
        phaseSetupAdapter: PhaseSetupPort,
        phaseTypeAdapter: PhaseTypePort,
        unitOfWork: UnitOfWorkPort,
      ) =>
        new CreateTournamentUseCase(
          userRepository,
          phaseSetupAdapter,
          phaseTypeAdapter,
          unitOfWork,
        ),
      inject: [
        TOURNAMENT_REPOSITORY,
        PHASE_SETUP,
        PHASE_TYPE_PORT,
        UNIT_OF_WORK,
      ],
    },
    {
      provide: GET_ALL_TOURNAMENTS_USE_CASE,
      useFactory: (tournamentRepository: TournamentRepositoryPort) =>
        new GetAllTournamentsUseCase(tournamentRepository),
      inject: [TOURNAMENT_REPOSITORY],
    },
    {
      provide: GET_TOURNAMENT_USE_CASE,
      useFactory: (tournamentRepository: TournamentRepositoryPort) =>
        new GetTournamentUseCase(tournamentRepository),
      inject: [TOURNAMENT_REPOSITORY],
    },
    {
      provide: DELETE_TOURNAMENT_USE_CASE,
      useFactory: (tournamentRepository: TournamentRepositoryPort) =>
        new DeleteTournamentUseCase(tournamentRepository),
      inject: [TOURNAMENT_REPOSITORY],
    },
    {
      provide: ADD_TEAM_TO_TOURNAMENT_USE_CASE,
      useFactory: (
        tournamentRepository: TournamentRepositoryPort,
        teamLookup: TeamLookupPort,
      ) => new AddTeamToTournamentUseCase(tournamentRepository, teamLookup),
      inject: [TOURNAMENT_REPOSITORY, TEAM_LOOKUP],
    },
    {
      provide: REMOVE_TEAM_FROM_TOURNAMENT_USE_CASE,
      useFactory: (
        tournamentRepository: TournamentRepositoryPort,
        teamLookup: TeamLookupPort,
      ) =>
        new RemoveTeamFromTournamentUseCase(tournamentRepository, teamLookup),
      inject: [TOURNAMENT_REPOSITORY, TEAM_LOOKUP],
    },
    {
      provide: REMOVE_TEAM_FROM_TOURNAMENT_USE_CASE,
      useFactory: (
        tournamentRepository: TournamentRepositoryPort,
        teamLookup: TeamLookupPort,
      ) =>
        new RemoveTeamFromTournamentUseCase(tournamentRepository, teamLookup),
      inject: [TOURNAMENT_REPOSITORY, TEAM_LOOKUP],
    },
    {
      provide: GENERATE_FIXTURE_TOURNAMENT_USE_CASE,
      useFactory: (
        tournamentRepository: TournamentRepositoryPort,
        phaseLookup: PhaseLookupPort,
        fixtureGeneration: FixtureGenerationPort,
        unitOfWork: UnitOfWorkPort,
        standingSetup: StandingSetupPort,
      ) =>
        new GenerateFixtureUseCase(
          tournamentRepository,
          phaseLookup,
          fixtureGeneration,
          unitOfWork,
          standingSetup,
        ),
      inject: [
        TOURNAMENT_REPOSITORY,
        PHASE_LOOKUP,
        FIXTURE_GENERATE_PORT,
        UNIT_OF_WORK,
        STANDING_SETUP_PORT,
      ],
    },
  ],
  controllers: [TournamentController],
})
export class TournamentsModule {}
