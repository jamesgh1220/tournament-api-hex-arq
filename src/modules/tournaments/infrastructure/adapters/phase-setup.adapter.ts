import { Inject } from "@nestjs/common";
import { PhaseSetupPort } from "../../domain/ports/phase-setup.port";
import { PhaseTournament } from "../../domain/value-objects/phase-tournament.vo";
import { CREATE_PHASE_USE_CASE } from "src/modules/phases/phases.tokens";
import { CreatePhaseUseCase } from "src/modules/phases/application/create-phase.use-case";

export class PhaseSetupAdapter implements PhaseSetupPort {
  constructor(
    @Inject(CREATE_PHASE_USE_CASE)
    private readonly createPhaseUseCase: CreatePhaseUseCase,
  ) {}

  async create(
    name: string,
    status: string,
    orderNumber: number,
    tournamentId: string,
    typeId: string,
  ): Promise<PhaseTournament> {
    const phase = await this.createPhaseUseCase.execute(
      name,
      status,
      orderNumber,
      tournamentId,
      typeId,
    );

    return PhaseTournament.create(
      phase.id,
      phase.name,
      phase.status,
      phase.orderNumber,
      phase.tournamentId,
      phase.typeId,
    );
  }
}
