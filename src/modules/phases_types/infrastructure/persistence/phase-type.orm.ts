import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { PhaseOrmEntity } from 'src/modules/phases/infrastructure/persistence/phase.orm';

@Entity('phase_type')
export class PhaseTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => PhaseOrmEntity, (phase_type) => phase_type.type)
  phases: PhaseOrmEntity[];
}
