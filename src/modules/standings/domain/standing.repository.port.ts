import { Standing } from "./standing.entity"

export interface StandingRepositoryPort {
  create(standing: Standing): Promise<Standing>;
  update(standing: Standing): Promise<Standing>;
  findByTournament(tournamentId: string): Promise<Standing | null>;
  findByTournamentAndTeam(tournamentId: string, teamId: string): Promise<Standing | null>;
}
