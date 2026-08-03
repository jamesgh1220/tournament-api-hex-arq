import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhaseRepositoryPort } from '../../domain/phase.repository.port';
import { PhaseOrmEntity } from './phase.orm';
import { Phase } from '../../domain/phase.entity';
import { TransactionContext } from 'src/shared/infrastructure/persistence/transaction-context';
import { MatchPhase } from '../../domain/value-objects/match-phase.vo';

@Injectable()
export class PhaseRepository implements PhaseRepositoryPort {
  constructor(
    @InjectRepository(PhaseOrmEntity)
    private readonly phaseRepository: Repository<PhaseOrmEntity>,
  ) {}

  private repo(): Repository<PhaseOrmEntity> {
    const manager = TransactionContext.getManager();
    return manager
      ? manager.getRepository(PhaseOrmEntity)
      : this.phaseRepository;
  }

  async create(phase: Phase): Promise<Phase> {
    const saved = await this.repo().save(this.toOrm(phase));
    return this.toDomain(saved);
  }

  async getByStatus(
    tournamentId: string,
    status: string,
  ): Promise<Phase | null> {
    const orm = await this.phaseRepository.findOne({
      where: { status, tournamentId },
    });
    return orm ? this.toDomain(orm) : null;
  }

  async getByTournament(tournamentId: string): Promise<Phase | null> {
    const orm = await this.phaseRepository.findOne({
      where: { tournamentId },
    });
    return orm ? this.toDomain(orm) : null;
  }

  async getByType(typeId: string): Promise<Phase | null> {
    throw new Error('Method not implemented.');
    // const orm = await this.phaseRepository.findOne({
    //   where: { typeId }
    // });
    // return orm ? this.toDomain(orm) : null;
  }

  async hasAssignedFixturehasAssignedFixture(
    id: string,
  ): Promise<Phase | null> {
    const orm = await this.phaseRepository.findOne({
      where: { id },
      relations: { matches: true },
    });

    return orm ? this.toDomain(orm) : null;
  }

  private toDomain(orm: PhaseOrmEntity): Phase {
    return Phase.fromPersistence({
      id: orm.id,
      name: orm.name,
      status: orm.status,
      orderNumber: orm.orderNumber,
      tournamentId: orm.tournamentId,
      typeId: orm.typeId,
      matches: (orm.matches ?? []).map((m) =>
        MatchPhase.create(
          m.id,
          m.phaseId,
          m.homeTeamId,
          m.awayTeamId,
          m.homeScore,
          m.awayScore,
          m.status,
        ),
      ),
    });
  }

  private toOrm(phase: Phase): PhaseOrmEntity {
    const orm = new PhaseOrmEntity();
    orm.id = phase.id;
    orm.name = phase.name;
    orm.status = phase.status;
    orm.orderNumber = phase.orderNumber;
    orm.tournamentId = phase.tournamentId;
    orm.typeId = phase.typeId;

    return orm;
  }
}
