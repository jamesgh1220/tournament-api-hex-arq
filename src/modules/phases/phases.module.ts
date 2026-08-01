import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhaseOrmEntity } from './infrastructure/persistence/phase.orm';
import { PhaseRepository } from './infrastructure/persistence/phase.repository';
import { CreatePhaseUseCase } from './application/create-phase.use-case';
import { GetPhaseByStatusUseCase } from './application/get-phase-by-status.use-case';
import { GetPhaseByTournamentUseCase } from './application/get-phase-by-tournament.use-case';
import { HasAssignedFixtureUseCase } from './application/has-assigned-fixture-phase.use-case';
import {
  PHASE_REPOSITORY,
  GET_PHASE_BY_STATUS_USE_CASE,
  GET_PHASE_BY_TOURNAMENT_USE_CASE,
  CREATE_PHASE_USE_CASE,
  HAS_ASSIGNED_FIXTURE_PHASE_USE_CASE,
} from './phases.tokens';
import { PhaseRepositoryPort } from './domain/phase.repository.port';
import { PhaseController } from './infrastructure/http/phase.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([PhaseOrmEntity]),
  ],
  providers: [
    {
      provide: PHASE_REPOSITORY,
      useClass: PhaseRepository,
    },
    {
      provide: CREATE_PHASE_USE_CASE,
      useFactory: (phaseRepository: PhaseRepositoryPort) =>
        new CreatePhaseUseCase(phaseRepository),
      inject: [PHASE_REPOSITORY],
    },
    {
      provide: GET_PHASE_BY_STATUS_USE_CASE,
      useFactory: (phaseRepository: PhaseRepositoryPort) =>
        new GetPhaseByStatusUseCase(phaseRepository),
      inject: [PHASE_REPOSITORY],
    },
    {
      provide: GET_PHASE_BY_TOURNAMENT_USE_CASE,
      useFactory: (phaseRepository: PhaseRepositoryPort) =>
        new GetPhaseByTournamentUseCase(phaseRepository),
      inject: [PHASE_REPOSITORY],
    },
    {
      provide: HAS_ASSIGNED_FIXTURE_PHASE_USE_CASE,
      useFactory: (phaseRepository: PhaseRepositoryPort) =>
        new HasAssignedFixtureUseCase(phaseRepository),
      inject: [PHASE_REPOSITORY],
    },
  ],
  exports: [
    CREATE_PHASE_USE_CASE,
    GET_PHASE_BY_STATUS_USE_CASE,
    HAS_ASSIGNED_FIXTURE_PHASE_USE_CASE,
  ],
  controllers: [PhaseController],
})
export class PhasesModule {}
