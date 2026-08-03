import { PhaseType } from './phase-type.entity';

export interface PhaseTypeRepositoryPort {
  findById(id: string): Promise<PhaseType | null>;
  findByName(name: string): Promise<PhaseType | null>;
  findAll(): Promise<PhaseType[]>;
  create(type: PhaseType): Promise<PhaseType>;
  update(type: PhaseType): Promise<PhaseType>;
  delete(id: string): Promise<void>;
}
