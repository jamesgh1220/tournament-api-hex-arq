import { Entity, PrimaryColumn, ManyToOne, Column } from 'typeorm';
import { PhaseOrmEntity } from 'src/modules/phases/infrastructure/persistence/phase.orm';
import { TournamentOrmEntity } from 'src/modules/tournaments/infrastructure/persistence/tournament.orm';
import { TeamOrmEntity } from 'src/modules/teams/infrastructure/persistence/team.orm';
import { GroupOrmEntity } from 'src/modules/groups/infrastructure/persistence/group.orm';

@Entity('standings')
export class StandingOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  tournamentId: string;
  @ManyToOne(() => TournamentOrmEntity, (tournament) => tournament.standings)
  tournament: TournamentOrmEntity;

  @Column()
  phaseId: string;
  @ManyToOne(() => PhaseOrmEntity, (phase) => phase.standings)
  phase: PhaseOrmEntity;

  @Column({ nullable: true })
  groupId: string | null;
  @ManyToOne(() => GroupOrmEntity, (group) => group.standings, {
    nullable: true,
  })
  group: GroupOrmEntity;

  @Column()
  teamId: string;
  @ManyToOne(() => TeamOrmEntity, (team) => team.standings)
  team: TeamOrmEntity;

  @Column()
  played: number;

  @Column()
  wins: number;

  @Column()
  draws: number;

  @Column()
  losses: number;

  @Column()
  goalsFor: number;

  @Column()
  goalsAgainst: number;

  @Column()
  points: number;
}
