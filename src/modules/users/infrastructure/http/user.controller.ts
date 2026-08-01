import {
  Get,
  Post,
  Body,
  Param,
  Inject,
  Controller,
  NotFoundException,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserUseCase } from "../../application/create-user.use-case";
import { GetUserUseCase } from "../../application/get-user.use-case";
import { GetAllUsersUseCase } from "../../application/get-all-users.use-case";
import { LoginUserUseCase } from "../../application/login-user.use-case";
import {
  CREATE_USER_USE_CASE,
  GET_USER_USE_CASE,
  GET_ALL_USERS_USE_CASE,
  LOGIN_USER_USE_CASE,
} from "../../user.tokens";
import { UserNotFoundError } from "../../domain/errors";

@Controller('users')
export class UserController {
  constructor(
    @Inject(CREATE_USER_USE_CASE)
    private readonly createUserUseCase: CreateUserUseCase,
    @Inject(GET_USER_USE_CASE)
    private readonly getUserUseCase: GetUserUseCase,
    @Inject(GET_ALL_USERS_USE_CASE)
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    @Inject(LOGIN_USER_USE_CASE)
    private readonly loginUserUseCase: LoginUserUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.createUserUseCase.execute(dto.name, dto.email, dto.password, dto.role);
    return UserResponseDto.fromDomain(user);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    const tokenResponse = await this.loginUserUseCase.execute(dto);
    return {
      accessToken: tokenResponse.accessToken,
      user: UserResponseDto.fromDomain(tokenResponse.user),
    };
  }

  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.getAllUsersUseCase.execute();
    return users.map(UserResponseDto.fromDomain);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<UserResponseDto> {
    try {
      const user = await this.getUserUseCase.execute(id);
      return UserResponseDto.fromDomain(user);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
