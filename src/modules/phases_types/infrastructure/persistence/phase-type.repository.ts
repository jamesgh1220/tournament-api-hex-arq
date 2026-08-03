import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhaseTypeOrmEntity } from './phase-type.orm';
import { PhaseTypeRepositoryPort } from '../../domain/phase-type.repository.port';
import { PhaseType } from '../../domain/phase-type.entity';

@Injectable()
export class PhaseTypeRepository implements PhaseTypeRepositoryPort {
  constructor(
    @InjectRepository(PhaseTypeOrmEntity)
    private readonly phaseTypeRepository: Repository<PhaseTypeOrmEntity>,
  ) {}

  async findById(id: string): Promise<PhaseType | null> {
    const orm = await this.phaseTypeRepository.findOne({
      where: { id },
    });

    return orm ? this.toDomain(orm) : null;
  }

  async findByName(name: string): Promise<PhaseType | null> {
    const orm = await this.phaseTypeRepository.findOne({
      where: { name },
    });

    return orm ? this.toDomain(orm) : null;
  }

  async findAll(): Promise<PhaseType[]> {
    return (await this.phaseTypeRepository.find()).map(this.toDomain);
  }

  async create(type: PhaseType): Promise<PhaseType> {
    const saved = await this.phaseTypeRepository.save(this.toOrm(type));
    return this.toDomain(saved);
  }

  async update(type: PhaseType): Promise<PhaseType> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<void> {
    await this.phaseTypeRepository.delete(id);
  }

  private toDomain(orm: PhaseTypeOrmEntity): PhaseType {
    return PhaseType.fromPersistence({
      id: orm.id,
      name: orm.name,
    });
  }

  private toOrm(type: PhaseType): PhaseTypeOrmEntity {
    const orm = new PhaseTypeOrmEntity();
    orm.id = type.id;
    orm.name = type.name;

    return orm;
  }
}
