// todo: generalizar
type UpdateMatch = {
  homeScore: number,
  awayScore: number,
  status: string,
};

export interface MatchLookupPort {
  // TODO: tipar respuesta
  matchExists(matchId: string, phaseId: string);
  // TODO: tipar respuesta
  update(matchId: string, data: UpdateMatch);
}