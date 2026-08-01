import { Tournament } from "./tournament.entity";

export interface TournamentRepositoryPort {
  create(tournament: Tournament): Promise<Tournament>;
  findById(id: string): Promise<Tournament | null>;
  findAll(): Promise<Tournament[]>;
  update(tournament: Tournament): Promise<void>;
  delete(id: string): Promise<void>;
  getTournamentWithTeams(id: string): Promise<Tournament | null>;
}
