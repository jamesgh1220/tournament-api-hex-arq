import { StandingByTournamentNotFoundError } from "../domain/errors";
import { Standing } from "../domain/standing.entity";
import { StandingRepositoryPort } from "../domain/standing.repository.port";

export class GetStandingByTournamentAndTeamUseCase {
  constructor(
    private readonly standingRepository: StandingRepositoryPort,
  ) {}

  async execute(tournamentId: string, teamId: string): Promise<Standing> {
    const standing = await this.standingRepository.findByTournamentAndTeam(tournamentId, teamId);
    if (!standing) throw new StandingByTournamentNotFoundError(tournamentId);
    
    return standing;
  }
}
