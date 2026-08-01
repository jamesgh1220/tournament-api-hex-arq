import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './modules/tasks/tasks.module';
import { UsersModule } from './modules/users/users.module';
import { UserOrmEntity } from './modules/users/infrastructure/persistence/user.orm';
import { TournamentOrmEntity } from './modules/tournaments/infrastructure/persistence/tournament.orm';
import { TournamentsModule } from './modules/tournaments/tournaments.module';
import { TeamsModule } from './modules/teams/teams.module';
import { TeamOrmEntity } from './modules/teams/infrastructure/persistence/team.orm';
import { MatchesModule } from './modules/matches/matches.module';
import { MatchOrmEntity } from './modules/matches/infrastructure/persistence/match.orm';
import { GroupsModule } from './modules/groups/groups.module';
import { GroupOrmEntity } from './modules/groups/infrastructure/persistence/group.orm';
import { StandingsModule } from './modules/standings/standings.module';
import { StandingOrmEntity } from './modules/standings/infrastructure/persistence/standing.orm';
import { PhasesModule } from './modules/phases/phases.module';
import { PhaseOrmEntity } from './modules/phases/infrastructure/persistence/phase.orm';
import { PhasesTypesModule } from './modules/phases_types/phases_types.module';
import { PhaseTypeOrmEntity } from './modules/phases_types/infrastructure/persistence/phase-type.orm';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.get('DB_HOST'),
        port: cfg.get<number>('DB_PORT'),
        username: cfg.get('DB_USER'),
        password: cfg.get('DB_PASS'),
        database: cfg.get('DB_NAME'),
        entities: [
          UserOrmEntity,
          TournamentOrmEntity,
          TeamOrmEntity,
          MatchOrmEntity,
          GroupOrmEntity,
          StandingOrmEntity,
          PhaseOrmEntity,
          PhaseTypeOrmEntity,
        ],
        synchronize: true,
      }),
    }),
    SharedModule,
    TasksModule,
    UsersModule,
    TournamentsModule,
    TeamsModule,
    MatchesModule,
    GroupsModule,
    StandingsModule,
    PhasesModule,
    PhasesTypesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
