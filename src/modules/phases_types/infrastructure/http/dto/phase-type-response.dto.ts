import { PhaseType } from 'src/modules/phases_types/domain/phase-type.entity';

export class PhaseTypeResponseDto {
  id: string;
  name: string;

  static fromDomain(type: PhaseType): PhaseTypeResponseDto {
    const dto = new PhaseTypeResponseDto();
    dto.id = type.id;
    dto.name = type.name;
    return dto;
  }
}
