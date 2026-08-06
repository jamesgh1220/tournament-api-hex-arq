import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StandingOrmEntity } from './standing.orm';
import { StandingRepositoryPort } from '../../domain/standing.repository.port';
import { Standing } from '../../domain/standing.entity';
import { TransactionContext } from 'src/shared/infrastructure/persistence/transaction-context';

@Injectable()
export class StandingRepository implements StandingRepositoryPort {
  constructor(
    @InjectRepository(StandingOrmEntity)
    private readonly standingRepository: Repository<StandingOrmEntity>,
  ) {}

  private repo(): Repository<StandingOrmEntity> {
    const manager = TransactionContext.getManager();
    return manager
      ? manager.getRepository(StandingOrmEntity)
      : this.standingRepository;
  }

  async create(standing: Standing): Promise<Standing> {
    const saved = await this.repo().save(this.toOrm(standing));
    return this.toDomain(saved);
  }

  async createMany(matches: Standing[]): Promise<Standing[]> {
    const orm = matches.map(this.toOrm);
    const saved = await this.repo().save(orm); // save acepta array
    return saved.map(this.toDomain);
  }

  async update(standing: Standing): Promise<Standing | null> {
    const orm = await this.repo().findOneBy({ id: standing.id });
    if (!orm) return null;

    orm.played = standing.played;
    orm.wins = standing.wins;
    orm.draws = standing.draws;
    orm.losses = standing.losses;
    orm.goalsFor = standing.goalsFor;
    orm.goalsAgainst = standing.goalsAgainst;
    orm.points = standing.points;
    orm.tournamentId = standing.tournamentId;
    orm.teamId = standing.teamId;
    orm.phaseId = standing.phaseId;
    orm.groupId = standing.groupId ?? null;

    const saved = await this.repo().save(orm);
    return this.toDomain(saved);
  }

  async findByTournament(tournamentId: string): Promise<Standing | null> {
    const orm = await this.standingRepository.findOne({
      where: {
        tournamentId,
      },
    });

    return orm ? this.toDomain(orm) : null;
  }

  async findByPhaseTournament(
    tournamentId: string,
    phaseId: string,
  ): Promise<Standing | null> {
    const orm = await this.standingRepository.findOne({
      where: {
        tournamentId,
        phaseId,
      },
    });

    return orm ? this.toDomain(orm) : null;
  }

  async findByTournamentAndTeam(
    tournamentId: string,
    teamId: string,
  ): Promise<Standing | null> {
    const orm = await this.standingRepository.findOne({
      where: {
        tournamentId,
        teamId,
      },
    });

    return orm ? this.toDomain(orm) : null;
  }

  async findByParams(params: object): Promise<Standing | null> {
    const orm = await this.standingRepository.findOne({ where: params });
    return orm ? this.toDomain(orm) : null;
  }

  private toDomain(orm: StandingOrmEntity): Standing {
    return Standing.fromPersistence({
      id: orm.id,
      played: orm.played,
      wins: orm.wins,
      draws: orm.draws,
      losses: orm.losses,
      goalsFor: orm.goalsFor,
      goalsAgainst: orm.goalsAgainst,
      points: orm.points,
      tournamentId: orm?.tournamentId,
      teamId: orm.teamId,
      phaseId: orm.phaseId,
      groupId: orm?.groupId,
    });
  }

  private toOrm(standing: Standing): StandingOrmEntity {
    const orm = new StandingOrmEntity();
    orm.id = standing.id;
    orm.played = standing.played;
    orm.wins = standing.wins;
    orm.draws = standing.draws;
    orm.losses = standing.losses;
    orm.goalsFor = standing.goalsFor;
    orm.goalsAgainst = standing.goalsAgainst;
    orm.points = standing.points;
    orm.tournamentId = standing.tournamentId;
    orm.teamId = standing.teamId;
    orm.phaseId = standing.phaseId;
    orm.groupId = standing.groupId;

    return orm;
  }
}
