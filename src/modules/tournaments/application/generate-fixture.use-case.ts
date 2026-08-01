import {
  TournamentNotFoundError,
  PhaseActiveByTournamentNotFoundError,
  PhaseHasAssignedFixtureError,
} from "../domain/errors";
import { TournamentRepositoryPort } from "../domain/tournament.repository.port";
import { FixtureGenerationPort } from "../domain/ports/fixture-generation.port";
import { PhaseLookupPort } from "../domain/ports/phase-lookup.port";
import { UnitOfWorkPort } from 'src/shared/application/ports/unit-of-work.port';

//TODO: llevar a types generales de dominio
export type GeneratedMatchSummary = {
  id: string;
  phaseId: string;
  homeTeamId: string;
  awayTeamId: string;
  scheduledAt: Date;
  groupId: string | null;
};

export class GenerateFixtureUseCase {
  constructor(
    private readonly tournamentRepository: TournamentRepositoryPort,
    private readonly phaseLookup: PhaseLookupPort,
    private readonly fixtureGeneration: FixtureGenerationPort,
    private readonly unitOfWork: UnitOfWorkPort,
  ) {}

  async execute(tournamentId: string): Promise<GeneratedMatchSummary[]> {
    // Traer torneo con sus equipos
    const tournament = await this.tournamentRepository.getTournamentWithTeams(tournamentId);
    if (!tournament) throw new TournamentNotFoundError(tournamentId);

    // Validar que si existan equipos
    tournament.assertCanGenerateFixture();

    //Traer fase activa del torneo
    const activePhase = await this.phaseLookup.findActiveByTournament(tournamentId);
    if (!activePhase) throw new PhaseActiveByTournamentNotFoundError(tournamentId);

    // Validar que esa phase no tenga partidos programados
    const phaseHasFixture = await this.phaseLookup.hasAssignedFixture(activePhase.id);
    if (phaseHasFixture) throw new PhaseHasAssignedFixtureError(activePhase.id);

    return this.unitOfWork.execute(async () => {
      const { teams, startDate, configuration } = tournament;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Opción A: no programar en el pasado
      const fixtureStartDate = startDate > today ? startDate : tomorrow;

      const matches = await this.fixtureGeneration.generateAndPersist({
        phaseId: activePhase.id,
        teamIds: teams.map((t) => t.id),
        fixtureStartDate,
        doubleRound: configuration?.doubleRound || true,
      });

      // luego: standingSetup.initialize(...)

      return matches;
    });
  }
}
