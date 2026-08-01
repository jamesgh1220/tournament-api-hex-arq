import { GroupOrmEntity } from 'src/modules/groups/infrastructure/persistence/group.orm';
import { MatchOrmEntity } from 'src/modules/matches/infrastructure/persistence/match.orm';
import { PhaseTypeOrmEntity } from 'src/modules/phases_types/infrastructure/persistence/phase-type.orm';
import { StandingOrmEntity } from 'src/modules/standings/infrastructure/persistence/standing.orm';
import { TournamentOrmEntity } from 'src/modules/tournaments/infrastructure/persistence/tournament.orm';
import {
  Entity,
  ManyToOne,
  Column,
  PrimaryColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('phases')
export class PhaseOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100, default: 'TO_COME' })
  status: string;

  @Column()
  orderNumber: number;

  @Column()
  tournamentId: string;
  @ManyToOne(() => TournamentOrmEntity, (tournament) => tournament.phases)
  @JoinColumn({ name: 'tournamentId' })
  tournament: TournamentOrmEntity;

  @Column()
  typeId: string;
  @ManyToOne(() => PhaseTypeOrmEntity, (type) => type.phases)
  @JoinColumn({ name: 'typeId' })
  type: PhaseTypeOrmEntity;

  @OneToMany(() => GroupOrmEntity, (group) => group.phase)
  groups: GroupOrmEntity[];

  @OneToMany(() => MatchOrmEntity, (match) => match.phase)
  matches: MatchOrmEntity[];

  @OneToMany(() => StandingOrmEntity, (standing) => standing.phase)
  standings: StandingOrmEntity[];
}
