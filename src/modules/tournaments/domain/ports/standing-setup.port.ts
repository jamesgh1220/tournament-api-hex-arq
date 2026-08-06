import { StandingTournament } from '../value-objects/standing-tournament.vo';

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

export interface StandingSetupPort {
  exists(tournamentId: string, phaseId: string): Promise<StandingTournament>;
  initialize(standings: InitialStandingInput[]): Promise<StandingTournament[]>;
  update(
    tournamentId: string,
    phaseId: string,
    teamId: string,
    stats: StandingStatsInput,
  ): Promise<StandingTournament>;
}
