import { Inject } from "@nestjs/common";
import { PhaseLookupPort } from "../../domain/ports/phase-lookup.port";
import {
  GET_PHASE_BY_STATUS_USE_CASE,
  HAS_ASSIGNED_FIXTURE_PHASE_USE_CASE,
} from "src/modules/phases/phases.tokens";
import { GetPhaseByStatusUseCase } from "src/modules/phases/application/get-phase-by-status.use-case";
import { HasAssignedFixtureUseCase } from "src/modules/phases/application/has-assigned-fixture-phase.use-case";
import { PhaseTournament } from "../../domain/value-objects/phase-tournament.vo";
import { PhaseActiveByTournamentNotFoundError as PhaseActiveNotFound } from "../../domain/errors";

export class PhaseLookupAdapter implements PhaseLookupPort {
  constructor(
    @Inject(GET_PHASE_BY_STATUS_USE_CASE)
    private readonly getPhaseByStatusUseCase: GetPhaseByStatusUseCase,
    @Inject(HAS_ASSIGNED_FIXTURE_PHASE_USE_CASE)
    private readonly hasAssignedFixtureUseCase: HasAssignedFixtureUseCase,
  ) {}

  async findActiveByTournament(tournamentId: string): Promise<PhaseTournament> {
    const phase = await this.getPhaseByStatusUseCase.execute(tournamentId, 'IN_PROGRESS');
    if (!phase) throw new PhaseActiveNotFound(tournamentId);

    return PhaseTournament.create(
      phase.id,
      phase.name,
      phase.status,
      phase.orderNumber,
      phase.tournamentId,
      phase.typeId,
    );
  }

  async hasAssignedFixture(id: string): Promise<boolean> {
    const phaseHasFixture = await this.hasAssignedFixtureUseCase.execute(id);
    return phaseHasFixture;
  }
}
