import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '../../domain/team.entity';
import { TeamOrmEntity } from './team.orm';
import { TeamRepositoryPort } from '../../domain/team.repository.port';

@Injectable()
export class TeamRepository implements TeamRepositoryPort {
  constructor(
    @InjectRepository(TeamOrmEntity)
    private readonly teamRepository: Repository<TeamOrmEntity>,
  ) {}

  async findById(id: string): Promise<Team | null> {
    const orm = await this.teamRepository.findOne({ where: { id } });
    return orm ? this.toDomain(orm) : null;
  }

  async findAll(): Promise<Team[]> {
    return (await this.teamRepository.find()).map(this.toDomain);
  }

  async create(team: Team): Promise<Team> {
    const saved = await this.teamRepository.save(this.toOrm(team));
    return this.toDomain(saved);
  }

  update(team: Team): Promise<Team> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<void> {
    await this.teamRepository.delete(id);
  }

  private toDomain(orm: TeamOrmEntity): Team {
    return Team.fromPersistence({
      id: orm.id,
      name: orm.name,
    });
  }

  private toOrm(team: Team): TeamOrmEntity {
    const orm = new TeamOrmEntity();
    orm.id = team.id;
    orm.name = team.name;
    return orm;
  }
}