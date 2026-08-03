import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchRepositoryPort } from '../../domain/match.repository.port';
import { MatchOrmEntity } from './match.orm';
import { Match } from '../../domain/match.entity';
import { TransactionContext } from 'src/shared/infrastructure/persistence/transaction-context';

@Injectable()
export class MatchRepository implements MatchRepositoryPort {
  constructor(
    @InjectRepository(MatchOrmEntity)
    private readonly matchRepository: Repository<MatchOrmEntity>,
  ) {}

  private repo(): Repository<MatchOrmEntity> {
    const manager = TransactionContext.getManager();
    return manager
      ? manager.getRepository(MatchOrmEntity)
      : this.matchRepository;
  }

  async findById(id: string): Promise<Match | null> {
    const orm = await this.matchRepository.findOne({ where: { id } });
    return orm ? this.toDomain(orm) : null;
  }

  async findAll(): Promise<Match[]> {
    return (await this.matchRepository.find()).map(this.toDomain);
  }

  async create(match: Match): Promise<Match> {
    const saved = await this.matchRepository.save(this.toOrm(match));
    return this.toDomain(saved);
  }

  async createMany(matches: Match[]): Promise<Match[]> {
    const orm = matches.map(this.toOrm);
    const saved = await this.repo().save(orm); // save acepta array
    return saved.map(this.toDomain);
  }

  async update(match: Match): Promise<Match | null> {
    const orm = await this.repo().findOneBy({ id: match.id });
    if (!orm) return null;

    orm.phaseId = match.phaseId;
    orm.groupId = match.groupId ?? undefined;
    orm.homeTeamId = match.homeTeamId;
    orm.awayTeamId = match.awayTeamId;
    orm.homeScore = match.homeScore;
    orm.awayScore = match.awayScore;
    orm.status = match.status;
    orm.scheduledAt = match.scheduledAt;

    const saved = await this.repo().save(orm);
    return this.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.matchRepository.delete(id);
  }

  private toDomain(orm: MatchOrmEntity): Match {
    return Match.fromPersistence({
      id: orm.id,
      phaseId: orm.phaseId,
      groupId: orm.groupId,
      homeTeamId: orm.homeTeamId,
      awayTeamId: orm.awayTeamId,
      homeScore: orm.homeScore,
      awayScore: orm.awayScore,
      status: orm.status,
      scheduledAt: orm.scheduledAt,
    });
  }

  private toOrm(match: Match): MatchOrmEntity {
    const orm = new MatchOrmEntity();
    orm.id = match.id;
    orm.phaseId = match.phaseId;
    orm.groupId = match.groupId || undefined;
    orm.homeTeamId = match.homeTeamId;
    orm.awayTeamId = match.awayTeamId;
    orm.homeScore = match.homeScore;
    orm.awayScore = match.awayScore;
    orm.status = match.status;
    orm.scheduledAt = match.scheduledAt;
    return orm;
  }
}
