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
import { GroupDto } from "./dto/group.dto";
import {
  CREATE_GROUP_USE_CASE,
  GET_GROUP_USE_CASE,
  GET_ALL_GROUPS_USE_CASE,
  DELETE_GROUP_USE_CASE,
  GET_GROUPS_BY_PHASE_USE_CASE,
} from "../../groups.tokens";
import { JwtAuthGuard } from "src/common/guards/jwt-auth-guard";
import { CreateGroupUseCase } from "../../application/create-group.use-case";
import { GetGroupUseCase } from "../../application/get-group.use-case";
import { GetAllGroupsUseCase } from "../../application/get-all-groups.use-case";
import { DeleteGroupUseCase } from "../../application/delete-group.use-case";
import { GetGroupsByPhaseUseCase } from "../../application/get-groups-by-phase.use-case";
import { GroupResponseDto } from "./dto/group-response.dto";
import { GroupNotFoundError, GroupByPhaseNotFoundError } from "../../domain/errors";

@UseGuards(JwtAuthGuard)
@Controller('groups')
export class GroupController {
  constructor(
    @Inject(CREATE_GROUP_USE_CASE)
    private readonly createGroupUseCase: CreateGroupUseCase,
    @Inject(GET_GROUP_USE_CASE)
    private readonly getGroupUseCase: GetGroupUseCase,
    @Inject(GET_ALL_GROUPS_USE_CASE)
    private readonly getAllGroupsUseCase: GetAllGroupsUseCase,
    @Inject(DELETE_GROUP_USE_CASE)
    private readonly deleteGroupUseCase: DeleteGroupUseCase,
    @Inject(GET_GROUPS_BY_PHASE_USE_CASE)
    private readonly getGroupsByPhaseUseCase: GetGroupsByPhaseUseCase,
  ) {}

  @Post()
  async create(@Body() dto: GroupDto): Promise<GroupResponseDto> {
    const group = await this.createGroupUseCase.execute(dto.name);
    return GroupResponseDto.fromDomain(group);
  }

  @Get()
  async findAll(): Promise<GroupResponseDto[]> {
    const groups = await this.getAllGroupsUseCase.execute();
    return groups.map(GroupResponseDto.fromDomain);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<GroupResponseDto> {
    try {
      const group = await this.getGroupUseCase.execute(id);
      return GroupResponseDto.fromDomain(group);
    } catch (error) {
      if (error instanceof GroupNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Get('phase/:phaseId')
  async findByPhase(@Param('phaseId') phaseId: string): Promise<GroupResponseDto> {
    try {
      const group = await this.getGroupsByPhaseUseCase.execute(phaseId);
      return GroupResponseDto.fromDomain(group);
    } catch (error) {
      if (error instanceof GroupByPhaseNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    try {
      return await this.deleteGroupUseCase.execute(id);
    } catch (error) {
      if (error instanceof GroupNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
