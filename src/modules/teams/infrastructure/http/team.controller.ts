import {
  Get,
  Controller,
  UseGuards,
  Inject,
  Param,
  Post,
  Body,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth-guard';
import { GetAllTeamsUseCase } from '../../application/get-all-teams.use-case';
import {
  CREATE_TEAM_USE_CASE,
  GET_ALL_TEAMS_USE_CASE,
  GET_TEAM_USE_CASE,
  DELETE_TEAM_USE_CASE,
} from '../../teams.tokens';
import { CreateTeamUseCase } from '../../application/create-team.use-case';
import { GetTeamUseCase } from '../../application/get-team.use-case';
import { DeleteTeamUseCase } from '../../application/delete-team.use-case';
import { TeamResponseDto } from './dto/team-response.dto';
import { TeamDto } from './dto/team.dto';

@UseGuards(JwtAuthGuard)
@Controller('teams')
export class TeamController {
  constructor(
    @Inject(CREATE_TEAM_USE_CASE)
    private readonly createTeamUseCase: CreateTeamUseCase,
    @Inject(GET_ALL_TEAMS_USE_CASE)
    private readonly getAllTeamsUseCase: GetAllTeamsUseCase,
    @Inject(GET_TEAM_USE_CASE)
    private readonly getTeamUseCase: GetTeamUseCase,
    @Inject(DELETE_TEAM_USE_CASE)
    private readonly deleteTeamUseCase: DeleteTeamUseCase,
  ) {}

  @Get()
  async findAll(): Promise<TeamResponseDto[]> {
    const teams = await this.getAllTeamsUseCase.execute();
    return teams.map(TeamResponseDto.fromDomain);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<TeamResponseDto> {
    const team = await this.getTeamUseCase.execute(id);
    return TeamResponseDto.fromDomain(team);
  }

  @Post()
  async create(@Body() dto: TeamDto): Promise<TeamResponseDto> {
    const team = await this.createTeamUseCase.execute(dto.name);
    return TeamResponseDto.fromDomain(team);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteTeamUseCase.execute(id);
  }
}
