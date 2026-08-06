import { TeamOrmEntity } from 'src/modules/teams/infrastructure/persistence/team.orm';
import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { GroupOrmEntity } from 'src/modules/groups/infrastructure/persistence/group.orm';
import { PhaseOrmEntity } from 'src/modules/phases/infrastructure/persistence/phase.orm';
import { MatchStatus } from '../../domain/enums/match-status.enum';

@Entity('matches')
export class MatchOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  phaseId: string;
  @ManyToOne(() => PhaseOrmEntity, (phase) => phase.matches)
  phase: PhaseOrmEntity;

  @Column({ nullable: true })
  groupId?: string;
  @ManyToOne(() => GroupOrmEntity, (group) => group.matches, {
    nullable: true,
  })
  group: GroupOrmEntity;

  @Column()
  homeTeamId: string;
  @ManyToOne(() => TeamOrmEntity, (team) => team.homeMatches)
  @JoinColumn({ name: 'homeTeamId' })
  homeTeam: TeamOrmEntity;

  @Column()
  awayTeamId: string;
  @ManyToOne(() => TeamOrmEntity, (team) => team.awayMatches)
  @JoinColumn({ name: 'awayTeamId' })
  awayTeam: TeamOrmEntity;

  @Column()
  homeScore: number;

  @Column()
  awayScore: number;

  @Column({ default: MatchStatus.TO_COME })
  status: string;

  @Column({ type: 'date' })
  scheduledAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
