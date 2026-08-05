import { Match } from './match.entity';

export interface MatchRepositoryPort {
  findById(id: string): Promise<Match | null>;
  findByParams(params: object): Promise<Match | null>;
  findAll(): Promise<Match[]>;
  create(match: Match): Promise<Match>;
  createMany(matches: Match[]): Promise<Match[]>;
  update(match: Match): Promise<Match | null>;
  delete(id: string): Promise<void>;
}
