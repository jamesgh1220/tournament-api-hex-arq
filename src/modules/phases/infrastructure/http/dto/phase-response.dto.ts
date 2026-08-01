import { Phase } from "src/modules/phases/domain/phase.entity";

export class PhaseResponseDto {
  id: string;
  name: string;
  status: string;
  orderNumber: number;
  tournamentId: string;
  typeId: string;

  static fromDomain(phase: Phase): PhaseResponseDto {
    const dto = new PhaseResponseDto();
    dto.id = phase.id;
    dto.name = phase.name;
    dto.status = phase.status;
    dto.orderNumber = phase.orderNumber;
    dto.tournamentId = phase.tournamentId;
    dto.typeId = phase.typeId;
    return dto;
  }
}
