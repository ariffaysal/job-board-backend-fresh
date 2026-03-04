"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(repository, entityName) {
        this.repository = repository;
        this.entityName = entityName;
    }
    createTenantQueryBuilder(user) {
        const queryBuilder = this.repository.createQueryBuilder(this.entityName);
        if (user.role === 'agency') {
            queryBuilder.andWhere(`${this.entityName}.${this.getTenantField()} = :agencyId`, { agencyId: user.agencyId });
        }
        else if (user.role === 'client' && user.clientId) {
            queryBuilder.andWhere(`${this.entityName}.clientId = :clientId`, { clientId: user.clientId });
        }
        return queryBuilder;
    }
    async findTenant(user, options) {
        const queryBuilder = this.createTenantQueryBuilder(user);
        if (options?.where)
            queryBuilder.andWhere(options.where);
        if (options?.relations && Array.isArray(options.relations)) {
            options.relations.forEach(relation => {
                queryBuilder.leftJoinAndSelect(`${this.entityName}.${relation}`, relation);
            });
        }
        return queryBuilder.getMany();
    }
    async findOneTenant(user, options) {
        const queryBuilder = this.createTenantQueryBuilder(user);
        if (options.where)
            queryBuilder.andWhere(options.where);
        if (options?.relations && Array.isArray(options.relations)) {
            options.relations.forEach(relation => {
                queryBuilder.leftJoinAndSelect(`${this.entityName}.${relation}`, relation);
            });
        }
        return queryBuilder.getOne();
    }
    async countTenant(user, options) {
        const queryBuilder = this.createTenantQueryBuilder(user);
        if (options?.where)
            queryBuilder.andWhere(options.where);
        return queryBuilder.getCount();
    }
    async create(data) {
        return this.repository.create(data);
    }
    async save(entity) { return this.repository.save(entity); }
    async remove(entity) { return this.repository.remove(entity); }
    async softRemove(entity) { return this.repository.softRemove(entity); }
    async recover(entity) { return this.repository.recover(entity); }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=base.repository.js.map