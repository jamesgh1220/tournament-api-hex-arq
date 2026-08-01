import { PhaseTournament } from "../value-objects/phase-tournament.vo";

export interface PhaseLookupPort {
  findActiveByTournament(tournamentId: string): Promise<PhaseTournament>;
  hasAssignedFixture(id: string): Promise<boolean>;
}
