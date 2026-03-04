import { Repository, SelectQueryBuilder, FindManyOptions, FindOneOptions } from 'typeorm';
import { CurrentUser } from '../decorators/current-user.decorator';

export abstract class BaseRepository<T extends object> {
  constructor(
    protected repository: Repository<T>,
    protected entityName: string,
  ) {}

  protected abstract getTenantField(): string;

  createTenantQueryBuilder(user: CurrentUser): SelectQueryBuilder<T> {
    const queryBuilder = this.repository.createQueryBuilder(this.entityName);
    if (user.role === 'agency') {
      queryBuilder.andWhere(`${this.entityName}.${this.getTenantField()} = :agencyId`, { agencyId: user.agencyId });
    } else if (user.role === 'client' && user.clientId) {
      queryBuilder.andWhere(`${this.entityName}.clientId = :clientId`, { clientId: user.clientId });
    }
    return queryBuilder;
  }

  async findTenant(user: CurrentUser, options?: FindManyOptions<T>): Promise<T[]> {
    const queryBuilder = this.createTenantQueryBuilder(user);
    if (options?.where) queryBuilder.andWhere(options.where);
    
    // Fixed: Handle relations correctly
    if (options?.relations && Array.isArray(options.relations)) {
      options.relations.forEach(relation => {
        queryBuilder.leftJoinAndSelect(`${this.entityName}.${relation}`, relation);
      });
    }
    return queryBuilder.getMany();
  }

  async findOneTenant(user: CurrentUser, options: FindOneOptions<T>): Promise<T | null> {
    const queryBuilder = this.createTenantQueryBuilder(user);
    if (options.where) queryBuilder.andWhere(options.where);
    if (options?.relations && Array.isArray(options.relations)) {
      options.relations.forEach(relation => {
        queryBuilder.leftJoinAndSelect(`${this.entityName}.${relation}`, relation);
      });
    }
    return queryBuilder.getOne();
  }

  async countTenant(user: CurrentUser, options?: FindManyOptions<T>): Promise<number> {
    const queryBuilder = this.createTenantQueryBuilder(user);
    if (options?.where) queryBuilder.andWhere(options.where);
    return queryBuilder.getCount();
  }

  async create(data: Partial<T>): Promise<T> {
    return this.repository.create(data as any) as unknown as T;
  }
  async save(entity: T): Promise<T> { return this.repository.save(entity); }
  async remove(entity: T): Promise<T> { return this.repository.remove(entity); }
  async softRemove(entity: T): Promise<T> { return this.repository.softRemove(entity); }
  async recover(entity: T): Promise<T> { return this.repository.recover(entity); }
}