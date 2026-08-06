import { StandingGenerator } from '../domain/service/standing-generator';
import { StandingRepositoryPort } from '../domain/standing.repository.port';
import { StandingStats } from '../domain/types/standing-stats';

export class UpdateStandingAfterMatchUseCase {
  constructor(
    private readonly standingRepository: StandingRepositoryPort,
    private readonly standingGenerator: StandingGenerator,
  ) {}

  async execute(
    tournamentId: string,
    phaseId: string,
    teamId: string,
    stats: StandingStats,
  ) {
    // consultar standing
    const teamStanding = await this.standingRepository.findByParams({
      tournamentId,
      phaseId,
      teamId,
    });

    if (!teamStanding)
      throw new Error(
        `Error encontrando la tabla de posiciones para el torneo con id ${tournamentId} y el equipo con id ${teamId}`,
      );

    const calculatedStandingTeam =
      this.standingGenerator.calculateStandingAfterMatch(teamStanding, stats);

    // Guardar
    return await this.standingRepository.update(calculatedStandingTeam);
  }
}
