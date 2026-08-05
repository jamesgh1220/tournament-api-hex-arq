import { TournamentRepositoryPort } from '../domain/tournament.repository.port';
import { MatchLookupPort } from '../domain/ports/match-lookup.port';
import {
  TournamentNotFoundError,
  MatchNotFoundError,
  StandingNotFoundError,
} from '../domain/errors';
import { UnitOfWorkPort } from 'src/shared/application/ports/unit-of-work.port';
import { MatchResult } from '../domain/value-objects/match-result.vo';
import { StandingSetupPort } from '../domain/ports/standing-setup.port';
import { toStandingStats } from '../domain/services/match-result-to-standing-stats';

export type UpdateMatchStandingInput = {
  homeScore: number;
  awayScore: number;
  status: string;
};

export class UpdateMatchStandingUseCase {
  constructor(
    private readonly tournamentRepository: TournamentRepositoryPort,
    private readonly matchLookup: MatchLookupPort,
    private readonly unitOfWork: UnitOfWorkPort,
    private readonly standingSetup: StandingSetupPort,
  ) {}

  async execute(
    tournamentId: string,
    matchId: string,
    data: UpdateMatchStandingInput,
  ) {
    const result = MatchResult.create(
      data.homeScore,
      data.awayScore,
      data.status,
    );

    // Validar existencia torneo
    const tournament = await this.tournamentRepository.findById(tournamentId);
    if (!tournament) throw new TournamentNotFoundError(tournamentId);

    //Validar existencia partido
    const match = await this.matchLookup.matchExists(matchId);
    if (!match) throw new MatchNotFoundError(matchId);

    // Validar que exista la tabla de posiciones para el torneo en la fase activa
    const standing = await this.standingSetup.exists(
      tournamentId,
      match.phaseId,
    );
    if (!standing) throw new StandingNotFoundError(tournamentId, match.phaseId);

    // Abrir transaction
    return this.unitOfWork.execute(async () => {
      // actualizar partido
      await this.matchLookup.update(matchId, result);

      // actualizar posiciones equipo local
      await this.standingSetup.update(
        tournamentId,
        match.phaseId,
        match.homeTeamId,
        toStandingStats(result, 'home'),
      );

      // actualizar posiciones equipo visitante
      await this.standingSetup.update(
        tournamentId,
        match.phaseId,
        match.awayTeamId,
        toStandingStats(result, 'away'),
      );
    });
  }
}
