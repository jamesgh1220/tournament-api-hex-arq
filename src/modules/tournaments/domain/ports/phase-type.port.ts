interface PhaseType {
  id: string;
  name: string;
}

export interface PhaseTypePort {
  findByName(name: string): Promise<PhaseType>;
}
