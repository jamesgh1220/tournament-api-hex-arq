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
} from '@nestjs/common';
import { PhaseTypeDto } from './dto/phase-type.dto';
import {
  CREATE_PHASE_TYPE_USE_CASE,
  GET_ALL_PHASE_TYPE_USE_CASE,
  GET_PHASE_TYPE_USE_CASE,
  DELETE_PHASE_TYPE_USE_CASE,
} from '../../phases-types.tokens';
import { CreatePhaseTypeUseCase } from '../../application/create-phase-type.use-case';
import { GetAllPhaseTypesUseCase } from '../../application/get-all-phases-types.use-case';
import { GetPhaseTypeUseCase } from '../../application/get-phase-type.use-case';
import { DeletePhaseTypeUseCase } from '../../application/delete-phase-type.use-case';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth-guard';
import { PhaseTypeResponseDto } from './dto/phase-type-response.dto';

@UseGuards(JwtAuthGuard)
@Controller('phase-types')
export class PhaseTypeController {
  constructor(
    @Inject(CREATE_PHASE_TYPE_USE_CASE)
    private readonly createPhaseTypeUseCase: CreatePhaseTypeUseCase,
    @Inject(GET_ALL_PHASE_TYPE_USE_CASE)
    private readonly getAllPhaseTypeUseCase: GetAllPhaseTypesUseCase,
    @Inject(GET_PHASE_TYPE_USE_CASE)
    private readonly getPhaseTypeUseCase: GetPhaseTypeUseCase,
    @Inject(DELETE_PHASE_TYPE_USE_CASE)
    private readonly detelePhaseTypeUseCase: DeletePhaseTypeUseCase,
  ) {}

  @Post()
  async create(@Body() dto: PhaseTypeDto): Promise<PhaseTypeResponseDto> {
    const type = await this.createPhaseTypeUseCase.execute(dto.name);
    return PhaseTypeResponseDto.fromDomain(type);
  }

  @Get()
  async getAll(): Promise<PhaseTypeResponseDto[]> {
    const types = await this.getAllPhaseTypeUseCase.execute();
    return types.map(PhaseTypeResponseDto.fromDomain);
  }

  @Get(':id')
  async get(@Param('id') id: string): Promise<PhaseTypeResponseDto> {
    const type = await this.getPhaseTypeUseCase.execute(id);
    return PhaseTypeResponseDto.fromDomain(type);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.detelePhaseTypeUseCase.execute(id);
  }
}
