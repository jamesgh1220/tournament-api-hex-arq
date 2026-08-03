import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TeamOrmEntity } from 'src/modules/teams/infrastructure/persistence/team.orm';
import { MatchOrmEntity } from 'src/modules/matches/infrastructure/persistence/match.orm';
import { StandingOrmEntity } from 'src/modules/standings/infrastructure/persistence/standing.orm';
import { PhaseOrmEntity } from 'src/modules/phases/infrastructure/persistence/phase.orm';

@Entity('groups')
export class GroupOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  phaseId: string;
  @ManyToOne(() => PhaseOrmEntity, (phase) => phase.groups)
  phase: PhaseOrmEntity;

  @ManyToMany(() => TeamOrmEntity, (team) => team.groups)
  @JoinTable({
    name: 'group_teams',
    joinColumn: {
      name: 'groupId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'teamId',
      referencedColumnName: 'id',
    },
  })
  teams: TeamOrmEntity[];

  @OneToMany(() => MatchOrmEntity, (match) => match.group)
  matches: MatchOrmEntity[];

  @OneToMany(() => StandingOrmEntity, (standing) => standing.group)
  standings: StandingOrmEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
