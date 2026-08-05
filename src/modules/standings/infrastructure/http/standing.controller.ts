import { Get, Param, Inject, UseGuards, Controller } from '@nestjs/common';
import { StandingResponseDto } from './dto/standing-response.dto';
import {
  CREATE_STANDING_USE_CASE,
  GET_STANDING_BY_TOURNAMENT_USE_CASE,
  GET_STANDING_BY_TOURNAMENT_AND_TEAM_USE_CASE,
} from '../../standing.tokens';
import { CreateStandingUseCase } from '../../application/create-standing.use-case';
import { GetStandingByTournamentUseCase } from '../../application/get-standing-by-tournament.use-case';
import { GetStandingByTournamentAndTeamUseCase } from '../../application/get-standing-by-tournament-and-team.use-case';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth-guard';

@UseGuards(JwtAuthGuard)
@Controller('standings')
export class StandingController {
  constructor(
    @Inject(CREATE_STANDING_USE_CASE)
    private readonly createStandingUseCase: CreateStandingUseCase,
    @Inject(GET_STANDING_BY_TOURNAMENT_USE_CASE)
    private readonly getStandingByTournamentUseCase: GetStandingByTournamentUseCase,
    @Inject(GET_STANDING_BY_TOURNAMENT_AND_TEAM_USE_CASE)
    private readonly getStandingByTournamentAndTeamUseCase: GetStandingByTournamentAndTeamUseCase,
  ) {}

  @Get('tournament/:tournamentId')
  async getByTournament(
    @Param('tournamentId') tournamentId: string,
  ): Promise<StandingResponseDto> {
    const standing =
      await this.getStandingByTournamentUseCase.execute(tournamentId);
    return StandingResponseDto.fromDomain(standing);
  }

  @Get('tournament/:tournamentId/team/:teamId')
  async getByTournamentAndTeam(
    @Param('tournamentId') tournamentId: string,
    @Param('teamId') teamId: string,
  ): Promise<StandingResponseDto> {
    const standing = await this.getStandingByTournamentAndTeamUseCase.execute(
      tournamentId,
      teamId,
    );
    return StandingResponseDto.fromDomain(standing);
  }
}
