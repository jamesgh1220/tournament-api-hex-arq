export type GenerateFixtureCommand = {
  phaseId: string;
  teamIds: string[];
  fixtureStartDate: Date;
  doubleRound?: boolean;
};

export type GeneratedMatchSummary = {
  id: string;
  phaseId: string;
  homeTeamId: string;
  awayTeamId: string;
  scheduledAt: Date;
  groupId: string | null;
};

export interface FixtureGenerationPort {
  generateAndPersist(
    command: GenerateFixtureCommand,
  ): Promise<GeneratedMatchSummary[]>;
}
