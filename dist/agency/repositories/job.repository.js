"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const job_entity_1 = require("../entities/job.entity");
const base_repository_1 = require("../../common/repositories/base.repository");
let JobRepository = class JobRepository extends base_repository_1.BaseRepository {
    constructor(repository) {
        super(repository, 'job');
    }
    getTenantField() {
        return 'client.agencyId';
    }
    async findJobsByUser(user, options) {
        const queryBuilder = this.createTenantQueryBuilder(user)
            .leftJoinAndSelect('job.client', 'client')
            .leftJoinAndSelect('job.applications', 'applications');
        if (user.role === 'client' && user.clientId) {
            queryBuilder.andWhere('job.clientId = :clientId', { clientId: user.clientId });
        }
        if (options?.where) {
            queryBuilder.andWhere(options.where);
        }
        if (options?.order) {
            Object.entries(options.order).forEach(([field, direction]) => {
                queryBuilder.addOrderBy(`job.${field}`, direction);
            });
        }
        if (options?.take) {
            queryBuilder.take(options.take);
        }
        if (options?.skip) {
            queryBuilder.skip(options.skip);
        }
        return queryBuilder.getMany();
    }
    async findJobById(user, jobId) {
        const queryBuilder = this.createTenantQueryBuilder(user)
            .leftJoinAndSelect('job.client', 'client')
            .leftJoinAndSelect('job.applications', 'applications')
            .where('job.id = :jobId', { jobId });
        if (user.role === 'client' && user.clientId) {
            queryBuilder.andWhere('job.clientId = :clientId', { clientId: user.clientId });
        }
        return queryBuilder.getOne();
    }
    async countJobsByUser(user, options) {
        const queryBuilder = this.createTenantQueryBuilder(user);
        if (user.role === 'client' && user.clientId) {
            queryBuilder.andWhere('job.clientId = :clientId', { clientId: user.clientId });
        }
        if (options?.where) {
            queryBuilder.andWhere(options.where);
        }
        return queryBuilder.getCount();
    }
    async findJobsByStatus(user, status) {
        const queryBuilder = this.createTenantQueryBuilder(user)
            .leftJoinAndSelect('job.client', 'client')
            .where('job.status = :status', { status });
        if (user.role === 'client' && user.clientId) {
            queryBuilder.andWhere('job.clientId = :clientId', { clientId: user.clientId });
        }
        return queryBuilder.getMany();
    }
    async findJobsByClient(user, clientId) {
        const queryBuilder = this.createTenantQueryBuilder(user)
            .leftJoinAndSelect('job.client', 'client')
            .leftJoinAndSelect('job.applications', 'applications')
            .where('job.clientId = :clientId', { clientId });
        if (user.role === 'client' && user.clientId !== clientId) {
            throw new Error('Access denied: Cannot view jobs for other clients');
        }
        return queryBuilder.getMany();
    }
    async createJob(user, jobData) {
        const job = this.repository.create(jobData);
        if (user.role === 'agency') {
            if (!jobData.clientId) {
                throw new Error('ClientId is required when creating a job');
            }
        }
        else if (user.role === 'client') {
            job.clientId = user.clientId;
        }
        return this.repository.save(job);
    }
    async updateJob(user, jobId, updateData) {
        const job = await this.findJobById(user, jobId);
        if (!job) {
            throw new Error('Job not found or access denied');
        }
        if (user.role === 'client' && job.clientId !== user.clientId) {
            throw new Error('Access denied: Cannot update job for other client');
        }
        Object.assign(job, updateData);
        return this.repository.save(job);
    }
    async deleteJob(user, jobId) {
        const job = await this.findJobById(user, jobId);
        if (!job) {
            throw new Error('Job not found or access denied');
        }
        if (user.role === 'client' && job.clientId !== user.clientId) {
            throw new Error('Access denied: Cannot delete job for other client');
        }
        await this.repository.softRemove(job);
    }
};
exports.JobRepository = JobRepository;
exports.JobRepository = JobRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], JobRepository);
//# sourceMappingURL=job.repository.js.map