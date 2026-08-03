import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToMany,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TournamentOrmEntity } from 'src/modules/tournaments/infrastructure/persistence/tournament.orm';
import { MatchOrmEntity } from 'src/modules/matches/infrastructure/persistence/match.orm';
import { GroupOrmEntity } from 'src/modules/groups/infrastructure/persistence/group.orm';
import { StandingOrmEntity } from 'src/modules/standings/infrastructure/persistence/standing.orm';

@Entity('teams')
export class TeamOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true, length: 100 })
  name: string;

  @ManyToMany(() => TournamentOrmEntity, (tournament) => tournament.teams)
  tournaments: TournamentOrmEntity[];

  @ManyToMany(() => GroupOrmEntity, (group) => group.teams)
  groups: GroupOrmEntity[];

  @OneToMany(() => MatchOrmEntity, (match) => match.homeTeam)
  homeMatches: MatchOrmEntity[];

  @OneToMany(() => MatchOrmEntity, (match) => match.awayTeam)
  awayMatches: MatchOrmEntity[];

  @OneToMany(() => StandingOrmEntity, (standing) => standing.team)
  standings: StandingOrmEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
