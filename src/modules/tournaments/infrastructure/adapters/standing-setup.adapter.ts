import { Inject } from '@nestjs/common';
import { StandingSetupPort } from '../../domain/ports/standing-setup.port';
import { CreateStandingUseCase } from 'src/modules/standings/application/create-standing.use-case';
import { CREATE_STANDING_USE_CASE } from 'src/modules/standings/standing.tokens';

// TODO:
interface InitialStanding {
  tournamentId: string;
  phaseId: string;
  teamId: string;
  groupId?: string;
}

export class StandingSetupAdapter implements StandingSetupPort {
  constructor(
    @Inject(CREATE_STANDING_USE_CASE)
    private readonly createStandingUseCase: CreateStandingUseCase,
  ) {}

  async initialize(standings: InitialStanding[]) {
    const initialStanding = await this.createStandingUseCase.execute(standings);
    if (!initialStanding)
      throw new Error(`
        Error creando la tabla de posiciones inicial para el torneo.
      `);

    return initialStanding;
  }
}
