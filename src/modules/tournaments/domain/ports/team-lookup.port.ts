import { TeamTournament } from "../value-objects/team-tournament.vo";

export interface TeamLookupPort {
  findById(id: string): Promise<TeamTournament>;
}
