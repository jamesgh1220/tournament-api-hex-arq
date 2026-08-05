import { TournamentRepositoryPort } from '../domain/tournament.repository.port';
import { MatchLookupPort } from '../domain/ports/match-lookup.port';
import {
  TournamentNotFoundError,
  MatchNotFoundError,
  PhaseActiveByTournamentNotFoundError,
} from '../domain/errors';
import { UnitOfWorkPort } from 'src/shared/application/ports/unit-of-work.port';
import { PhaseLookupPort } from '../domain/ports/phase-lookup.port';

// todo: generalizar
type UpdateMatch = {
  homeScore: number,
  awayScore: number,
  status: string,
};

export class UpdateMatchStandingUseCase {
  constructor(
    private readonly tournamentRepository: TournamentRepositoryPort,
    private readonly matchLookup: MatchLookupPort,
    private readonly unitOfWork: UnitOfWorkPort,
    private readonly phaseLookup: PhaseLookupPort,
  ) {}

  async execute(
    tournamentId: string,
    matchId: string,
    data: UpdateMatch,
  ) {
    // Validar existencia torneo
    const tournament = await this.tournamentRepository.findById(tournamentId);
    if (!tournament) throw new TournamentNotFoundError(tournamentId);

    //Traer fase activa del torneo
    const activePhase =
      await this.phaseLookup.findActiveByTournament(tournamentId);
    if (!activePhase || !activePhase.id)
      throw new PhaseActiveByTournamentNotFoundError(tournamentId);

    //Validar existencia partido
    const match = await this.matchLookup.matchExists(matchId, activePhase.id);
    if (!match) throw new MatchNotFoundError(matchId, activePhase.id);

    // Abrir transaction
    return this.unitOfWork.execute(async () => {
      // actualizar partido
      await this.matchLookup.update(matchId, data);

      // actualizar posiciones
    });
  }
}
