import { GeneratedMatchSummary } from 'src/modules/tournaments/domain/ports/fixture-generation.port';

export class GeneratedMatchSummaryDto {
  id: string;
  phaseId: string;
  homeTeamId: string;
  awayTeamId: string;
  scheduledAt: Date;
  groupId: string | null;

  static fromSummary(summary: GeneratedMatchSummary): GeneratedMatchSummaryDto {
    const dto = new GeneratedMatchSummaryDto();
    dto.id = summary.id;
    dto.phaseId = summary.phaseId;
    dto.homeTeamId = summary.homeTeamId;
    dto.awayTeamId = summary.awayTeamId;
    dto.scheduledAt = summary.scheduledAt;
    dto.groupId = summary.groupId;
    return dto;
  }
}
