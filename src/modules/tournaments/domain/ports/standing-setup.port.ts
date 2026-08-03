// TODO: llevar a un punto general

interface InitialStanding {
  tournamentId: string;
  phaseId: string;
  teamId: string;
  groupId?: string;
}

// TODO: creaer type de respuesta
export interface StandingSetupPort {
  initialize(standings: InitialStanding[]);
}
