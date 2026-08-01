import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UnitOfWorkPort } from '../../application/ports/unit-of-work.port';
import { TransactionContext } from './transaction-context';

@Injectable()
export class TypeOrmUnitOfWork implements UnitOfWorkPort {
  constructor(private readonly dataSource: DataSource) {}

  execute<T>(work: () => Promise<T>): Promise<T> {
    return this.dataSource.transaction((manager) =>
      TransactionContext.run(manager, work),
    );
  }
}
