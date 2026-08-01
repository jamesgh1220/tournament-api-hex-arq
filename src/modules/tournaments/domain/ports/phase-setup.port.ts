import { PhaseTournament } from "../value-objects/phase-tournament.vo";

export interface PhaseSetupPort {
  create(
    name: string,
    status: string,
    orderNumber: number,
    tournamentId: string,
    typeId: string,
  ): Promise<PhaseTournament>;
}
