import { Inject } from '@nestjs/common';
import {
  InitialStandingInput,
  StandingSetupPort,
} from '../../domain/ports/standing-setup.port';
import { CreateStandingUseCase } from 'src/modules/standings/application/create-standing.use-case';
import { GetStandingByPhaseTournamentUseCase } from 'src/modules/standings/application/get-standing-by-phase-tournament.use-case';
import {
  CREATE_STANDING_USE_CASE,
  GET_STANDING_BY_PHASE_TOURNAMENT_USE_CASE,
} from 'src/modules/standings/standing.tokens';

export class StandingSetupAdapter implements StandingSetupPort {
  constructor(
    @Inject(CREATE_STANDING_USE_CASE)
    private readonly createStandingUseCase: CreateStandingUseCase,
    @Inject(GET_STANDING_BY_PHASE_TOURNAMENT_USE_CASE)
    private readonly getStandingByPhaseTournamentUseCase: GetStandingByPhaseTournamentUseCase,
  ) {}

  async exists(tournamentId: string, phaseId: string) {
    return await this.getStandingByPhaseTournamentUseCase.execute(
      tournamentId,
      phaseId,
    );
  }

  async initialize(standings: InitialStandingInput[]) {
    const initialStanding =
      await this.createStandingUseCase.execute(standings);
    if (!initialStanding)
      throw new Error(`
        Error creando la tabla de posiciones inicial para el torneo.
      `);

    return initialStanding;
  }

  async update(tournamentId: string, phaseId: string, teamId: string) {
    throw new Error('Method not implemented.');
  }
}
