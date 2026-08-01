import { Phase } from "./phase.entity";

export interface PhaseRepositoryPort {
  create(phase: Phase): Promise<Phase>;
  getByStatus(tournamentId: string, status: string): Promise<Phase | null>;
  getByTournament(tournamentId: string): Promise<Phase | null>;
  getByType(typeId: string): Promise<Phase | null>;
  hasAssignedFixturehasAssignedFixture(id: string): Promise<Phase | null>;
}
