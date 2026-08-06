import { Standing } from './standing.entity';

export interface StandingRepositoryPort {
  create(standing: Standing): Promise<Standing>;
  createMany(matches: Standing[]): Promise<Standing[]>;
  update(standing: Standing): Promise<Standing | null>;
  findByTournament(tournamentId: string): Promise<Standing | null>;
  findByPhaseTournament(tournamentId: string, phaseId: string): Promise<Standing | null>;
  findByTournamentAndTeam(
    tournamentId: string,
    teamId: string,
  ): Promise<Standing | null>;
  findByParams(params: object): Promise<Standing | null>;
}
