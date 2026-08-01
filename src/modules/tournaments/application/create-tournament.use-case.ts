import { TournamentRepositoryPort } from "../domain/tournament.repository.port";
import { Tournament } from "../domain/tournament.entity";
import { randomUUID } from "crypto";
import { PhaseSetupPort } from "../domain/ports/phase-setup.port";
import { PhaseTypePort } from "../domain/ports/phase-type.port";
import { LifecycleStatus } from "src/shared/domain/enums/lifecycle-status.enum";
import { DEFAULT_LEAGUE_PHASE_NAME } from "../domain/constants/default-phase-names";
import { UnitOfWorkPort } from 'src/shared/application/ports/unit-of-work.port';

export class CreateTournamentUseCase {
  constructor(
    private readonly tournamentRepository: TournamentRepositoryPort,
    private readonly phaseSetupAdapter: PhaseSetupPort,
    private readonly phaseTypeAdapter: PhaseTypePort,
    private readonly unitOfWork: UnitOfWorkPort,
  ) {}

  async execute(
    name: string,
    state: string,
    configuration: Record<string, any>,
    startDate: Date,
  ): Promise<Tournament> {
    // Begin transaction
    return this.unitOfWork.execute(async () => {
      const tournament = Tournament.create(randomUUID(), name, state, configuration, startDate);
      // Creacion del torneo
      const saved = await this.tournamentRepository.create(tournament);

      if (saved && tournament.shouldCreatePhaseAutomatically()) {
        // Traer el tipo de fase establecido para 'Liga'
        const phaseType = await this.phaseTypeAdapter.findByName('LEAGUE');
        if (phaseType && phaseType.id) {
          // Crear la unica fase que tiene un torneo de tipo 'Liga'
          await this.phaseSetupAdapter.create(
            DEFAULT_LEAGUE_PHASE_NAME,
            LifecycleStatus.IN_PROGRESS,
            1, // orden
            saved.id,
            phaseType.id,
          );
        }      
      }
  
      return saved;
    });
  }
}
