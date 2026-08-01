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
} from "@nestjs/common";
import { MatchDto } from "./dto/match.dto";
import {
  CREATE_MATCH_USE_CASE,
  DELETE_MATCH_USE_CASE,
  GET_MATCH_USE_CASE,
  GET_ALL_MATCHES_USE_CASE,
} from "../../match.tokens";
import { CreateMatchUseCase } from "../../application/create-match.use-case";
import { DeleteMatchUseCase } from "../../application/delete-match.use-case";
import { GetMatchUseCase } from "../../application/get-match.use-case";
import { GetAllMatchesUseCase } from "../../application/get-all-matches.use-cases";
import { JwtAuthGuard } from "src/common/guards/jwt-auth-guard";
import { MatchResponseDto } from "./dto/match-response.dto";
import { MatchNotFoundError } from "../../domain/errors";

@UseGuards(JwtAuthGuard)
@Controller('matches')
export class MatchController {
  constructor(
    @Inject(CREATE_MATCH_USE_CASE)
    private readonly createMatchUseCase: CreateMatchUseCase,
    @Inject(DELETE_MATCH_USE_CASE)
    private readonly deleteMatchUseCase: DeleteMatchUseCase,
    @Inject(GET_MATCH_USE_CASE)
    private readonly getMatchUseCase: GetMatchUseCase,
    @Inject(GET_ALL_MATCHES_USE_CASE)
    private readonly getAllMatchesUseCase: GetAllMatchesUseCase,
  ) {}

  @Post()
  async create(@Body() dto: MatchDto): Promise<MatchResponseDto> {
    const match = await this.createMatchUseCase.execute(
      dto.phaseId,
      dto.homeTeamId,
      dto.awayTeamId,
      dto.homeScore,
      dto.awayScore,
      dto.status,
      new Date(dto.scheduledAt),
      dto.groupId,
    );

    return MatchResponseDto.fromDomain(match);
  }
  
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    try {
      await this.deleteMatchUseCase.execute(id);
    } catch (error) {
      if (error instanceof MatchNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Get(':id')
  async get(@Param('id') id: string): Promise<MatchResponseDto> {
    try {
      const match = await this.getMatchUseCase.execute(id);
      return MatchResponseDto.fromDomain(match);
    } catch (error) {
      if (error instanceof MatchNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Get()
  async getAll(): Promise<MatchResponseDto[]> {
    const matches = await this.getAllMatchesUseCase.execute();
    return matches.map(MatchResponseDto.fromDomain);
  }
}
