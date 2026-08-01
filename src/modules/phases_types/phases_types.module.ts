import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhaseTypeOrmEntity } from './infrastructure/persistence/phase-type.orm';
import { PhaseTypeRepository } from './infrastructure/persistence/phase-type.repository';
import { CreatePhaseTypeUseCase } from './application/create-phase-type.use-case';
import { GetPhaseTypeByNameUseCase } from './application/get-phase-type-by-name.use-case';
import { GetPhaseTypeUseCase } from './application/get-phase-type.use-case';
import { DeletePhaseTypeUseCase } from './application/delete-phase-type.use-case';
import { GetAllPhaseTypesUseCase } from './application/get-all-phases-types.use-case';
import {
  PHASE_TYPE_REPOSITORY,
  CREATE_PHASE_TYPE_USE_CASE,
  DELETE_PHASE_TYPE_USE_CASE,
  GET_PHASE_TYPE_USE_CASE,
  GET_ALL_PHASE_TYPE_USE_CASE,
  GET_PHASE_TYPE_BY_NAME_USE_CASE,
} from './phases-types.tokens';
import { PhaseTypeRepositoryPort } from './domain/phase-type.repository.port';
import { PhaseTypeController } from './infrastructure/http/phase-type.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([PhaseTypeOrmEntity]),
  ],
  providers: [
    {
      provide: PHASE_TYPE_REPOSITORY,
      useClass: PhaseTypeRepository,
    },
    {
      provide: CREATE_PHASE_TYPE_USE_CASE,
      useFactory: (phaseTypeRepository: PhaseTypeRepositoryPort) =>
        new CreatePhaseTypeUseCase(phaseTypeRepository),
      inject: [PHASE_TYPE_REPOSITORY],
    },
    {
      provide: GET_PHASE_TYPE_BY_NAME_USE_CASE,
      useFactory: (phaseTypeRepository: PhaseTypeRepositoryPort) =>
        new GetPhaseTypeByNameUseCase(phaseTypeRepository),
      inject: [PHASE_TYPE_REPOSITORY],
    },
    {
      provide: DELETE_PHASE_TYPE_USE_CASE,
      useFactory: (phaseTypeRepository: PhaseTypeRepositoryPort) =>
        new DeletePhaseTypeUseCase(phaseTypeRepository),
      inject: [PHASE_TYPE_REPOSITORY],
    },
    {
      provide: GET_PHASE_TYPE_USE_CASE,
      useFactory: (phaseTypeRepository: PhaseTypeRepositoryPort) =>
        new GetPhaseTypeUseCase(phaseTypeRepository),
      inject: [PHASE_TYPE_REPOSITORY],
    },
    {
      provide: GET_ALL_PHASE_TYPE_USE_CASE,
      useFactory: (phaseTypeRepository: PhaseTypeRepositoryPort) =>
        new GetAllPhaseTypesUseCase(phaseTypeRepository),
      inject: [PHASE_TYPE_REPOSITORY],
    },
  ],
  exports: [GET_PHASE_TYPE_BY_NAME_USE_CASE],
  controllers: [PhaseTypeController],
})
export class PhasesTypesModule {}
