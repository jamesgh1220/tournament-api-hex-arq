import { Global, Module } from '@nestjs/common';
import { UNIT_OF_WORK } from './shared.tokens';
import { TypeOrmUnitOfWork } from './infrastructure/persistence/typeorm-unit-of-work';

@Global() // opcional; evita importarlo en cada feature module
@Module({
  providers: [
    {
      provide: UNIT_OF_WORK,
      useClass: TypeOrmUnitOfWork,
    },
  ],
  exports: [UNIT_OF_WORK],
})
export class SharedModule {}
