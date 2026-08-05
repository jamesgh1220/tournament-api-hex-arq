import {
  Get,
  Post,
  Body,
  Param,
  Inject,
  UseGuards,
  Controller,
} from '@nestjs/common';
import { PhaseDto } from './dto/phase.dto';
import {
  CREATE_PHASE_USE_CASE,
  GET_PHASE_BY_STATUS_USE_CASE,
  GET_PHASE_BY_TOURNAMENT_USE_CASE,
  HAS_ASSIGNED_FIXTURE_PHASE_USE_CASE,
} from '../../phases.tokens';
import { CreatePhaseUseCase } from '../../application/create-phase.use-case';
import { GetPhaseByStatusUseCase } from '../../application/get-phase-by-status.use-case';
import { GetPhaseByTournamentUseCase } from '../../application/get-phase-by-tournament.use-case';
import { HasAssignedFixtureUseCase } from '../../application/has-assigned-fixture-phase.use-case';
import { PhaseResponseDto } from './dto/phase-response.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth-guard';

@UseGuards(JwtAuthGuard)
@Controller('phases')
export class PhaseController {
  constructor(
    @Inject(CREATE_PHASE_USE_CASE)
    private readonly createPhaseUseCase: CreatePhaseUseCase,
    @Inject(GET_PHASE_BY_STATUS_USE_CASE)
    private readonly getPhaseByStatusUseCase: GetPhaseByStatusUseCase,
    @Inject(GET_PHASE_BY_TOURNAMENT_USE_CASE)
    private readonly getPhaseByTournamentUseCase: GetPhaseByTournamentUseCase,
    @Inject(HAS_ASSIGNED_FIXTURE_PHASE_USE_CASE)
    private readonly hasAssignedFixtureUseCase: HasAssignedFixtureUseCase,
  ) {}

  @Post()
  async create(@Body() dto: PhaseDto): Promise<PhaseResponseDto> {
    const phase = await this.createPhaseUseCase.execute(
      dto.name,
      dto.status,
      dto.orderNumber,
      dto.tournamentId,
      dto.typeId,
    );

    return PhaseResponseDto.fromDomain(phase);
  }

  @Get('status/:status/tournament/:tournamentId')
  async getByStatus(
    @Param('tournamentId') tournamentId: string,
    @Param('status') status: string,
  ): Promise<PhaseResponseDto> {
    const phase = await this.getPhaseByStatusUseCase.execute(
      tournamentId,
      status,
    );
    return PhaseResponseDto.fromDomain(phase);
  }

  @Get('tournament/:tournamentId')
  async getByTournament(
    @Param('tournamentId') tournamentId: string,
  ): Promise<PhaseResponseDto> {
    const phase =
      await this.getPhaseByTournamentUseCase.execute(tournamentId);
    return PhaseResponseDto.fromDomain(phase);
  }

  @Get(':id/has-fixture')
  async getHasAssignedFixture(@Param('id') id: string): Promise<boolean> {
    return await this.hasAssignedFixtureUseCase.execute(id);
  }
}
