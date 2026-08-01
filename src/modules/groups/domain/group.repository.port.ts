import { Group } from "./group.entity";

export interface GroupRepositoryPort {
  create(group: Group): Promise<Group>;
  update(group: Group): Promise<Group>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Group | null>;
  findAll(): Promise<Group[]>;
  findByPhase(phaseId: string): Promise<Group | null>;
}
