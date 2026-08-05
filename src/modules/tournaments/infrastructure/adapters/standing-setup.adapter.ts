import { Inject } from '@nestjs/common';
import {
  InitialStandingInput,
  StandingSetupPort,
  StandingStatsInput,
} from '../../domain/ports/standing-setup.port';
import { CreateStandingUseCase } from 'src/modules/standings/application/create-standing.use-case';
import { GetStandingByPhaseTournamentUseCase } from 'src/modules/standings/application/get-standing-by-phase-tournament.use-case';
import { UpdateStandingAfterMatchUseCase } from 'src/modules/standings/application/update-standing-after-match.use-case';
import {
  CREATE_STANDING_USE_CASE,
  GET_STANDING_BY_PHASE_TOURNAMENT_USE_CASE,
  UPDATE_STANDING_AFTER_MATCH_USE_CASE,
} from 'src/modules/standings/standing.tokens';

export class StandingSetupAdapter implements StandingSetupPort {
  constructor(
    @Inject(CREATE_STANDING_USE_CASE)
    private readonly createStandingUseCase: CreateStandingUseCase,
    @Inject(GET_STANDING_BY_PHASE_TOURNAMENT_USE_CASE)
    private readonly getStandingByPhaseTournamentUseCase: GetStandingByPhaseTournamentUseCase,
    @Inject(UPDATE_STANDING_AFTER_MATCH_USE_CASE)
    private readonly updateStandingAfterMatchUseCase: UpdateStandingAfterMatchUseCase,
  ) {}

  // TODO: tipar respuesta
  async exists(tournamentId: string, phaseId: string) {
    return await this.getStandingByPhaseTournamentUseCase.execute(
      tournamentId,
      phaseId,
    );
  }
  // TODO: tipar respuesta
  async initialize(standings: InitialStandingInput[]) {
    const initialStanding =
      await this.createStandingUseCase.execute(standings);
    if (!initialStanding)
      throw new Error(`
        Error creando la tabla de posiciones inicial para el torneo.
      `);

    return initialStanding;
  }
  // TODO: tipar respuesta
  async update(
    tournamentId: string,
    phaseId: string,
    teamId: string,
    stats: StandingStatsInput,
  ) {
    return await this.updateStandingAfterMatchUseCase.execute(
      tournamentId,
      phaseId,
      teamId,
      stats,
    );
  }
}
