import { Tournament } from 'src/modules/tournaments/domain/tournament.entity';

export class TournamentResponseDto {
  id: string;
  name: string;
  state: string;
  configuration: Record<string, any>;
  startDate: Date;
  teams?: { id: string; name: string }[];

  static fromDomain(tournament: Tournament): TournamentResponseDto {
    const dto = new TournamentResponseDto();
    dto.id = tournament.id;
    dto.name = tournament.name;
    dto.state = tournament.state;
    dto.configuration = tournament.configuration;
    dto.startDate = tournament.startDate;

    if (tournament.teams.length > 0) {
      dto.teams = tournament.teams.map((t) => ({
        id: t.id,
        name: t.name,
      }));
    }

    return dto;
  }
}
