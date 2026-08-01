import { AsyncLocalStorage } from 'async_hooks';
import { EntityManager } from 'typeorm';

export class TransactionContext {
  private static readonly storage = new AsyncLocalStorage<EntityManager>();

  static run<T>(manager: EntityManager, fn: () => Promise<T>): Promise<T> {
    return this.storage.run(manager, fn);
  }

  static getManager(): EntityManager | undefined {
    return this.storage.getStore();
  }
}
