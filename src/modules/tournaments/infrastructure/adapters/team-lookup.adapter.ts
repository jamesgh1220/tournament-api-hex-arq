import { Inject } from '@nestjs/common';
import { TeamLookupPort } from '../../domain/ports/team-lookup.port';
import { TeamTournament } from '../../domain/value-objects/team-tournament.vo';
import { GET_TEAM_USE_CASE } from 'src/modules/teams/teams.tokens';
import { GetTeamUseCase } from 'src/modules/teams/application/get-team.use-case';
import { TeamNotFoundError as TeamsTeamNotFoundError } from 'src/modules/teams/domain/errors';
import { TeamNotFoundError } from '../../domain/errors';

export class TeamLookupAdapter implements TeamLookupPort {
  constructor(
    @Inject(GET_TEAM_USE_CASE)
    private readonly getTeamUseCase: GetTeamUseCase,
  ) {}

  async findById(id: string): Promise<TeamTournament> {
    try {
      const team = await this.getTeamUseCase.execute(id);
      return TeamTournament.create(team.id, team.name);
    } catch (error) {
      if (error instanceof TeamsTeamNotFoundError) {
        throw new TeamNotFoundError(id);
      }
      throw error;
    }
  }
}
