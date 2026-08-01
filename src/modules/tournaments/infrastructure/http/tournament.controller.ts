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
  BadRequestException,
} from "@nestjs/common";
import { TournamentDto } from "./dto/tournament.dto";
import {
  CREATE_TOURNAMENT_USE_CASE,
  GET_TOURNAMENT_USE_CASE,
  GET_ALL_TOURNAMENTS_USE_CASE,
  DELETE_TOURNAMENT_USE_CASE,
  ADD_TEAM_TO_TOURNAMENT_USE_CASE,
  REMOVE_TEAM_FROM_TOURNAMENT_USE_CASE,
  GENERATE_FIXTURE_TOURNAMENT_USE_CASE,
} from "../../tournament.tokens";
import { JwtAuthGuard } from "src/common/guards/jwt-auth-guard";
import { CreateTournamentUseCase } from "../../application/create-tournament.use-case";
import { GetAllTournamentsUseCase } from "../../application/get-all-tournaments.use-case";
import { GetTournamentUseCase } from "../../application/get-tournament.use-case";
import { DeleteTournamentUseCase } from "../../application/delete-tournament.use-case";
import { AddTeamToTournamentUseCase } from "../../application/add-team-to-tournament.use-case";
import { RemoveTeamFromTournamentUseCase } from "../../application/remove-team-from-tournament.use-case";
import { TournamentResponseDto } from "./dto/tournament-response.dto";
import { GenerateFixtureUseCase } from "../../application/generate-fixture.use-case";
import {
  TournamentNotFoundError,
  TeamNotFoundError,
  TeamAlreadyInTournamentError,
  TeamNotInTournamentError,
  GenerateGixtureTournamentError,
  PhaseActiveByTournamentNotFoundError,
  InsufficientTeamsForFixtureError,
  PhaseHasAssignedFixtureError,
} from "../../domain/errors";

//TODO: llevar a types generales de dominio
export type GeneratedMatchSummary = {
  id: string;
  phaseId: string;
  homeTeamId: string;
  awayTeamId: string;
  scheduledAt: Date;
  groupId: string | null;
};

@UseGuards(JwtAuthGuard)
@Controller('tournaments')
export class TournamentController {
  constructor(
    @Inject(CREATE_TOURNAMENT_USE_CASE)
    private readonly createTournamentUseCase: CreateTournamentUseCase,
    @Inject(GET_ALL_TOURNAMENTS_USE_CASE)
    private readonly getAllTournamentsUseCase: GetAllTournamentsUseCase,
    @Inject(GET_TOURNAMENT_USE_CASE)
    private readonly getTournamentUseCase: GetTournamentUseCase,
    @Inject(DELETE_TOURNAMENT_USE_CASE)
    private readonly deleteTournamentUseCase: DeleteTournamentUseCase,
    @Inject(ADD_TEAM_TO_TOURNAMENT_USE_CASE)
    private readonly addTeamToTournamentUseCase: AddTeamToTournamentUseCase,
    @Inject(REMOVE_TEAM_FROM_TOURNAMENT_USE_CASE)
    private readonly removeTeamFromTournamentUseCase: RemoveTeamFromTournamentUseCase,
    @Inject(GENERATE_FIXTURE_TOURNAMENT_USE_CASE)
    private readonly generateFixtureUseCase: GenerateFixtureUseCase,
  ) {}

  @Post()
  async create(@Body() dto: TournamentDto): Promise<TournamentResponseDto> {
    const tournament = await this.createTournamentUseCase.execute(dto.name, dto.state, dto.configuration, dto.startDate);
    return TournamentResponseDto.fromDomain(tournament);
  }

  @Get()
  async findAll(): Promise<TournamentResponseDto[]> {
    const tournaments = await this.getAllTournamentsUseCase.execute();
    return tournaments.map(TournamentResponseDto.fromDomain);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<TournamentResponseDto> {
    try {
      const tournament = await this.getTournamentUseCase.execute(id);
      return TournamentResponseDto.fromDomain(tournament);
    } catch (error) {
      if (error instanceof TournamentNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    try {
      return await this.deleteTournamentUseCase.execute(id);
    } catch (error) {
      if (error instanceof TournamentNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Post(':id/teams/:teamId')
  async addTeamToTournament(
    @Param('id') id: string,
    @Param('teamId') teamId: string,
  ): Promise<TournamentResponseDto> {
    try {
      const tournament = await this.addTeamToTournamentUseCase.execute(id, teamId);
      return TournamentResponseDto.fromDomain(tournament);
    } catch (error) {
      if (error instanceof TournamentNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof TeamNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof TeamAlreadyInTournamentError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Delete(':id/teams/:teamId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTeamFromTournament(
    @Param('id') id: string,
    @Param('teamId') teamId: string,
  ) {
    try {
      return await this.removeTeamFromTournamentUseCase.execute(id, teamId);
    } catch (error) {
      if (error instanceof TournamentNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof TeamNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof TeamNotInTournamentError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Post(':id/generate-fixture')
  //TODO: tipar respuesta
  async generateFixture(@Param('id') id: string): Promise<GeneratedMatchSummary[]> {
    try {
      return await this.generateFixtureUseCase.execute(id);
    } catch (error) {
      if (error instanceof TournamentNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof PhaseActiveByTournamentNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof InsufficientTeamsForFixtureError) {
        throw new BadRequestException(error.message); // 400
      }
      if (error instanceof GenerateGixtureTournamentError) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof PhaseHasAssignedFixtureError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
}
