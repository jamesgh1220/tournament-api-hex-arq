export interface InitialStandingInput {
  tournamentId: string;
  phaseId: string;
  teamId: string;
  groupId?: string;
}

export interface StandingStatsInput {
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

// TODO: crear type de respuesta
export interface StandingSetupPort {
  exists(tournamentId: string, phaseId: string): Promise<boolean>;
  initialize(standings: InitialStandingInput[]);
  update(
    tournamentId: string,
    phaseId: string,
    teamId: string,
    stats: StandingStatsInput,
  );
}
