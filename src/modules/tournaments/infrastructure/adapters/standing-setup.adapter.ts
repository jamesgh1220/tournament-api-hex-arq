import { Inject } from "@nestjs/common";
import { CREATE_MATCH_USE_CASE } from "src/modules/matches/match.tokens";
import { StandingSetupPort } from "../../domain/ports/standing-setup.port";
import { CreateStandingUseCase } from "src/modules/standings/application/create-standing.use-case";


// TODO:
interface InitialStanding {
  tournamentId: string;
  phaseId: string;
  teamId: string;
  groupId?: string;
}

export class StandingSetupAdapter implements StandingSetupPort {
  constructor(
    @Inject(CREATE_MATCH_USE_CASE)
    private readonly createStandingUseCase: CreateStandingUseCase,
  ) {}

  async initialize(standings: InitialStanding[]) {
    const initialStanding = await this.createStandingUseCase.execute(
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      tournamentId,
      teamId,
      phaseId,
      groupId,
    );
    if (!initialStanding)
      throw new Error(`
        Error creando la tabla de posiciones inicial para el torneo ${tournamentId}.
      `);

    return initialStanding;
  }
}
