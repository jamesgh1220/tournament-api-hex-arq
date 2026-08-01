import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupOrmEntity } from './group.orm';
import { GroupRepositoryPort } from '../../domain/group.repository.port';
import { Group } from '../../domain/group.entity';

@Injectable()
export class GroupRepository implements GroupRepositoryPort {
  constructor(
    @InjectRepository(GroupOrmEntity)
    private readonly groupRepository: Repository<GroupOrmEntity>,
  ) {}

  async create(group: Group): Promise<Group> {
    const saved = await this.groupRepository.save(this.toOrm(group));
    return this.toDomain(saved);
  }

  async update(group: Group): Promise<Group> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<void> {
    await this.groupRepository.delete(id);
  }

  async findById(id: string): Promise<Group | null> {
    const orm = await this.groupRepository.findOne({ where: { id } });
    return orm ? this.toDomain(orm) : null;
  }

  async findAll(): Promise<Group[]> {
    return (await this.groupRepository.find()).map(this.toDomain);
  }

  async findByPhase(phaseId: string): Promise<Group | null> {
    const orm = await this.groupRepository.findOne({ where: { phaseId } });
    return orm ? this.toDomain(orm) : null;
  }

  private toDomain(orm: GroupOrmEntity): Group {
    return Group.fromPersistence({
      id: orm.id,
      name: orm.name,
      phaseId: orm.phaseId,
    });
  }

  private toOrm(group: Group): GroupOrmEntity {
    const orm = new GroupOrmEntity();
    orm.id = group.id;
    orm.name = group.name;
    return orm;
  }
}
