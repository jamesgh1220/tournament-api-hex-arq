import {
  Get,
  Post,
  Body,
  Param,
  Inject,
  Delete,
  HttpCode,
  UseGuards,
  HttpStatus,
  Controller,
  NotFoundException,
} from '@nestjs/common';
import { StandingDto } from './dto/standing.dto';
import { StandingResponseDto } from './dto/standing-response.dto';
import {
  CREATE_STANDING_USE_CASE,
  GET_STANDING_BY_TOURNAMENT_USE_CASE,
  GET_STANDING_BY_TOURNAMENT_AND_TEAM_USE_CASE,
} from '../../standing.tokens';
import { CreateStandingUseCase } from '../../application/create-standing.use-case';
import { GetStandingByTournamentUseCase } from '../../application/get-standing-by-tournament.use-case';
import { GetStandingByTournamentAndTeamUseCase } from '../../application/get-standing-by-tournament-and-team.use-case';
import { StandingByTournamentNotFoundError } from '../../domain/errors';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth-guard';
import { Standing } from '../../domain/standing.entity';

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

  // @Post()
  // async create(@Body() dto: StandingDto): Promise<StandingResponseDto> {
  //   const standing = await this.createStandingUseCase.execute(
  //     dto.played,
  //     dto.wins,
  //     dto.draws,
  //     dto.losses,
  //     dto.goalsFor,
  //     dto.goalsAgainst,
  //     dto.points,
  //     dto.tournamentId,
  //     dto.teamId,
  //     dto.phaseId,
  //     dto.groupId,
  //   );

  //   return StandingResponseDto.fromDomain(standing);
  // }

  @Get('tournament/:tournamentId')
  async getByTournament(
    @Param('tournamentId') tournamentId: string,
  ): Promise<StandingResponseDto> {
    try {
      const standing =
        await this.getStandingByTournamentUseCase.execute(tournamentId);
      return StandingResponseDto.fromDomain(standing);
    } catch (error) {
      if (error instanceof StandingByTournamentNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Get('tournament/:tournamentId/team/:teamId')
  async getByTournamentAndTeam(
    @Param('tournamentId') tournamentId: string,
    @Param('teamId') teamId: string,
  ): Promise<StandingResponseDto> {
    try {
      const standing = await this.getStandingByTournamentAndTeamUseCase.execute(
        tournamentId,
        teamId,
      );
      return StandingResponseDto.fromDomain(standing);
    } catch (error) {
      if (error instanceof StandingByTournamentNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
