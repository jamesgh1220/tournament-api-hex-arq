import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserController } from './infrastructure/http/user.controller';
import { CreateUserUseCase } from './application/create-user.use-case';
import { GetUserUseCase } from './application/get-user.use-case';
import { GetAllUsersUseCase } from './application/get-all-users.use-case';
import { LoginUserUseCase } from './application/login-user.use-case';
import { UserRepositoryPort } from './domain/user.repository.port';
import { UserRepository } from './infrastructure/persistence/user.repository';
import { UserOrmEntity } from './infrastructure/persistence/user.orm';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  USER_REPOSITORY,
  CREATE_USER_USE_CASE,
  GET_USER_USE_CASE,
  GET_ALL_USERS_USE_CASE,
  LOGIN_USER_USE_CASE,
  USER_ADAPTER,
} from './user.tokens';
import { UserAdapter } from './infrastructure/adapters/user-login.adapter';
import { UserPort } from './domain/login.port';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.get('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
    TypeOrmModule.forFeature([UserOrmEntity]),
  ],
  controllers: [UserController],
  providers: [
    JwtStrategy,
    {
      provide: USER_ADAPTER,
      useClass: UserAdapter,
    },
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: CREATE_USER_USE_CASE,
      useFactory: (userAdapter: UserPort, userRepository: UserRepositoryPort) =>
        new CreateUserUseCase(userAdapter, userRepository),
      inject: [USER_ADAPTER, USER_REPOSITORY],
    },
    {
      provide: GET_USER_USE_CASE,
      useFactory: (userRepository: UserRepositoryPort) =>
        new GetUserUseCase(userRepository),
      inject: [USER_REPOSITORY],
    },
    {
      provide: GET_ALL_USERS_USE_CASE,
      useFactory: (userRepository: UserRepositoryPort) =>
        new GetAllUsersUseCase(userRepository),
      inject: [USER_REPOSITORY],
    },
    {
      provide: LOGIN_USER_USE_CASE,
      useFactory: (
        loginAdapter: UserPort,
        userRepository: UserRepositoryPort,
      ) => new LoginUserUseCase(loginAdapter, userRepository),
      inject: [USER_ADAPTER, USER_REPOSITORY],
    },
  ],
  exports: [GET_USER_USE_CASE, PassportModule],
})
export class UsersModule {}
