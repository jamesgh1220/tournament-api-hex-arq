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
import { StandingTournament } from '../../domain/value-objects/standing-tournament.vo';
import { StandingNotFoundError } from '../../domain/errors';

export class StandingSetupAdapter implements StandingSetupPort {
  constructor(
    @Inject(CREATE_STANDING_USE_CASE)
    private readonly createStandingUseCase: CreateStandingUseCase,
    @Inject(GET_STANDING_BY_PHASE_TOURNAMENT_USE_CASE)
    private readonly getStandingByPhaseTournamentUseCase: GetStandingByPhaseTournamentUseCase,
    @Inject(UPDATE_STANDING_AFTER_MATCH_USE_CASE)
    private readonly updateStandingAfterMatchUseCase: UpdateStandingAfterMatchUseCase,
  ) {}

  async exists(tournamentId: string, phaseId: string): Promise<StandingTournament> {
    const standing = await this.getStandingByPhaseTournamentUseCase.execute(
      tournamentId,
      phaseId,
    );

    return new StandingTournament(
      standing.id,
      standing.played,
      standing.wins,
      standing.draws,
      standing.losses,
      standing.goalsFor,
      standing.goalsAgainst,
      standing.points,
      standing.tournamentId,
      standing.teamId,
      standing.phaseId,
      standing.groupId,
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

  async update(
    tournamentId: string,
    phaseId: string,
    teamId: string,
    stats: StandingStatsInput,
  ): Promise<StandingTournament> {
    const standing = await this.updateStandingAfterMatchUseCase.execute(
      tournamentId,
      phaseId,
      teamId,
      stats,
    );
    if (!standing) throw new StandingNotFoundError(tournamentId, phaseId)

    return new StandingTournament(
      standing.id,
      standing.played,
      standing.wins,
      standing.draws,
      standing.losses,
      standing.goalsFor,
      standing.goalsAgainst,
      standing.points,
      standing.tournamentId,
      standing.teamId,
      standing.phaseId,
      standing.groupId,
    );
  }
}
