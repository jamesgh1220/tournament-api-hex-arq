import { Team } from './team.entity';

export interface TeamRepositoryPort {
  findById(id: string): Promise<Team | null>;
  findAll(): Promise<Team[]>;
  create(team: Team): Promise<Team>;
  update(team: Team): Promise<Team>;
  delete(id: string): Promise<void>;
}
