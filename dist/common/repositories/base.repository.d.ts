import { Repository, SelectQueryBuilder, FindManyOptions, FindOneOptions } from 'typeorm';
import { CurrentUser } from '../decorators/current-user.decorator';
export declare abstract class BaseRepository<T extends object> {
    protected repository: Repository<T>;
    protected entityName: string;
    constructor(repository: Repository<T>, entityName: string);
    protected abstract getTenantField(): string;
    createTenantQueryBuilder(user: CurrentUser): SelectQueryBuilder<T>;
    findTenant(user: CurrentUser, options?: FindManyOptions<T>): Promise<T[]>;
    findOneTenant(user: CurrentUser, options: FindOneOptions<T>): Promise<T | null>;
    countTenant(user: CurrentUser, options?: FindManyOptions<T>): Promise<number>;
    create(data: Partial<T>): Promise<T>;
    save(entity: T): Promise<T>;
    remove(entity: T): Promise<T>;
    softRemove(entity: T): Promise<T>;
    recover(entity: T): Promise<T>;
}
