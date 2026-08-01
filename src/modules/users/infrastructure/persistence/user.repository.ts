import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/user.entity';
import { UserOrmEntity } from './user.orm';
import { UserRepositoryPort } from "../../domain/user.repository.port";

@Injectable()
export class UserRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepository: Repository<UserOrmEntity>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const orm = await this.userRepository.findOne({ where: { email } });
    return orm ? this.toDomain(orm) : null;
  }

  async findById(id: string): Promise<User | null> {
    const orm = await this.userRepository.findOne({ where: { id } });
    return orm ? this.toDomain(orm) : null;
  }

  async findAll(): Promise<User[]> {
    return (await this.userRepository.find()).map(this.toDomain);
  }

  async save(user: User): Promise<User> {
    const saved = await this.userRepository.save(this.toOrm(user));
    return this.toDomain(saved);
  }

  private toOrm(user: User): UserOrmEntity {
    const orm = new UserOrmEntity();
    orm.id = user.id;
    orm.name = user.name;
    orm.email = user.email;
    orm.password = user.password;
    orm.role = user.role;
    orm.active = user.active;
    return orm;
  }

  private toDomain(orm: UserOrmEntity): User {
    return User.fromPersistence({
      id: orm.id,
      name: orm.name,
      email: orm.email,
      password: orm.password,
      role: orm.role,
      active: orm.active,
    });
  }
}