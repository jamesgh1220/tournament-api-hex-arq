import { TournamentRepositoryPort } from '../domain/tournament.repository.port';
import { TeamLookupPort } from '../domain/ports/team-lookup.port';
import {
  TournamentNotFoundError,
  TeamNotFoundError,
  TeamNotInTournamentError,
} from '../domain/errors';
import { Tournament } from '../domain/tournament.entity';

export class RemoveTeamFromTournamentUseCase {
  constructor(
    private readonly tournamentRepository: TournamentRepositoryPort,
    private readonly teamLookup: TeamLookupPort,
  ) {}

  async execute(tournamentId: string, teamId: string): Promise<Tournament> {
    const tournament =
      await this.tournamentRepository.getTournamentWithTeams(tournamentId);
    if (!tournament) throw new TournamentNotFoundError(tournamentId);

    const team = await this.teamLookup.findById(teamId);

    // Validar que el equipo ya este en el torneo
    const teamInTournament = tournament.teams.some((t) => t.id === teamId);
    if (!teamInTournament) throw new TeamNotInTournamentError(teamId);

    // Remover el equipo del torneo
    tournament.removeTeam(teamId); // la entidad valida y muta
    await this.tournamentRepository.create(tournament);

    return tournament;
  }
}
