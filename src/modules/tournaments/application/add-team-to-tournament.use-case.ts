import { TournamentRepositoryPort } from "../domain/tournament.repository.port";
import {
  TournamentNotFoundError,
  TeamAlreadyInTournamentError,
} from "../domain/errors";
import { TeamLookupPort } from "../domain/ports/team-lookup.port";
import { Tournament } from "../domain/tournament.entity";

export class AddTeamToTournamentUseCase {
  constructor(
    private readonly tournamentRepository: TournamentRepositoryPort,
    private readonly teamLookup: TeamLookupPort,
  ) {}

  async execute(tournamentId: string, teamId: string): Promise<Tournament> {
    // Traer torneo con sus equipos
    const tournament = await this.tournamentRepository.getTournamentWithTeams(tournamentId);
    if (!tournament) throw new TournamentNotFoundError(tournamentId);

    const team = await this.teamLookup.findById(teamId);

    // Validar que el equipo no este ya en el torneo
    const teamInTournament = tournament.teams.some(t => t.id === teamId);
    if (teamInTournament) throw new TeamAlreadyInTournamentError(teamId);

    // Agregar el equipo al torneo
    tournament.addTeam(team);
    await this.tournamentRepository.create(tournament);

    return tournament;
  }
}
