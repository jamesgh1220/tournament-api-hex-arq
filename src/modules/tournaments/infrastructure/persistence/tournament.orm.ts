import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { TeamOrmEntity } from 'src/modules/teams/infrastructure/persistence/team.orm';
import { StandingOrmEntity } from 'src/modules/standings/infrastructure/persistence/standing.orm';
import { PhaseOrmEntity } from 'src/modules/phases/infrastructure/persistence/phase.orm';

@Entity('tournaments')
export class TournamentOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true, length: 100 })
  name: string;

  @Column({ length: 100, default: 'TO_COME' })
  state: string;

  @Column({ type: 'jsonb' })
  configuration: Record<string, any>;

  @Column({ type: 'date' })
  startDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => TeamOrmEntity, (team) => team.tournaments)
  @JoinTable({
    name: 'tournaments_teams',
    joinColumn: { name: 'tournamentId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'teamId', referencedColumnName: 'id' },
  })
  teams: TeamOrmEntity[];

  @OneToMany(() => PhaseOrmEntity, (phase) => phase.tournament)
  phases: PhaseOrmEntity[];

  @OneToMany(() => StandingOrmEntity, (standing) => standing.tournament)
  standings: StandingOrmEntity[];
}
