import { StandingGenerator } from '../domain/service/standing-generator';
import { Standing } from '../domain/standing.entity';
import { StandingRepositoryPort } from '../domain/standing.repository.port';

// TODO: generalizar
interface StandingStats {
  wins: number,
  draws: number,
  losses: number,
  goalsFor: number,
  goalsAgainst: number,
  points: number,
}

export class UpdateStandingAfterMatchUseCase {
  constructor(
    private readonly standingRepository: StandingRepositoryPort,
    private readonly standingGenerator: StandingGenerator,
  ) {}

  async execute(tournamentId: string, phaseId: string, teamId: string, stats: StandingStats) {
    // TODO: trycatch
    // consultar standing con homeTeamId
    const teamStanding = await this.standingRepository.findByParams({
      tournamentId,
      phaseId,
      teamId,
    });

    if (!teamStanding)
      throw new Error(`Error encontrando la tabla de posiciones para el torneo con id ${tournamentId} y el equipo con id ${teamId}`)

    const calculatedStandingHomeTeam = this.standingGenerator.calculateStandingAfterMatch(teamStanding, stats);
    const teamStandingUpdated = { ...teamStanding, ...calculatedStandingHomeTeam };
    console.log('test: ', teamStandingUpdated);

    // Guardar

    // consultar standing con awayTeamId
  }
}