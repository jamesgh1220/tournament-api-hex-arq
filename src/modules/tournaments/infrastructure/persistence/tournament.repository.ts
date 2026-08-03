import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from '../../domain/tournament.entity';
import { TournamentRepositoryPort } from '../../domain/tournament.repository.port';
import { TournamentOrmEntity } from './tournament.orm';
import { TeamTournament } from '../../domain/value-objects/team-tournament.vo';
import { TeamOrmEntity } from 'src/modules/teams/infrastructure/persistence/team.orm';
import { TransactionContext } from 'src/shared/infrastructure/persistence/transaction-context';

@Injectable()
export class TournamentRepository implements TournamentRepositoryPort {
  constructor(
    @InjectRepository(TournamentOrmEntity)
    private readonly tournamentRepository: Repository<TournamentOrmEntity>,
  ) {}

  private repo(): Repository<TournamentOrmEntity> {
    const manager = TransactionContext.getManager();
    return manager
      ? manager.getRepository(TournamentOrmEntity)
      : this.tournamentRepository;
  }

  async create(tournament: Tournament): Promise<Tournament> {
    const saved = await this.repo().save(this.toOrm(tournament));
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<Tournament | null> {
    const orm = await this.tournamentRepository.findOne({ where: { id } });
    return orm ? this.toDomain(orm) : null;
  }

  async findAll(): Promise<Tournament[]> {
    return (await this.tournamentRepository.find()).map(this.toDomain);
  }

  update(tournament: Tournament): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<void> {
    await this.tournamentRepository.delete(id);
  }

  async getTournamentWithTeams(id: string): Promise<Tournament | null> {
    const orm = await this.tournamentRepository.findOne({
      where: { id },
      relations: { teams: true },
    });
    return orm ? this.toDomain(orm) : null;
  }

  private toDomain(orm: TournamentOrmEntity): Tournament {
    return Tournament.fromPersistence({
      id: orm.id,
      name: orm.name,
      state: orm.state,
      configuration: orm.configuration,
      startDate: new Date(orm.startDate),
      teams: (orm.teams ?? []).map((t) => TeamTournament.create(t.id, t.name)),
    });
  }

  private toOrm(tournament: Tournament): TournamentOrmEntity {
    const orm = new TournamentOrmEntity();
    orm.id = tournament.id;
    orm.name = tournament.name;
    orm.state = tournament.state;
    orm.configuration = tournament.configuration;
    orm.startDate = tournament.startDate;

    // Solo IDs: TypeORM actualiza la join table, no crea equipos
    orm.teams = tournament.teams.map((t) => {
      const teamOrm = new TeamOrmEntity();
      teamOrm.id = t.id;
      teamOrm.name = t.name;
      return teamOrm;
    });

    return orm;
  }
}
