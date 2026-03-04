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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const job_repository_1 = require("../repositories/job.repository");
const job_entity_1 = require("../entities/job.entity");
let JobsService = class JobsService {
    constructor(jobRepository) {
        this.jobRepository = jobRepository;
    }
    async findAll(user, filters) {
        const options = {
            relations: ['client', 'applications'],
            order: { createdAt: 'DESC' },
        };
        const whereConditions = {};
        if (filters?.status) {
            whereConditions.status = filters.status;
        }
        if (filters?.type) {
            whereConditions.type = filters.type;
        }
        if (filters?.experienceLevel) {
            whereConditions.experienceLevel = filters.experienceLevel;
        }
        if (filters?.clientId) {
            if (user.role === 'client' && filters.clientId !== user.clientId) {
                throw new common_1.ForbiddenException('Cannot view jobs for other clients');
            }
            whereConditions.clientId = filters.clientId;
        }
        if (Object.keys(whereConditions).length > 0) {
            options.where = whereConditions;
        }
        if (filters?.limit) {
            options.take = filters.limit;
        }
        if (filters?.offset) {
            options.skip = filters.offset;
        }
        const [jobs, total] = await Promise.all([
            this.jobRepository.findJobsByUser(user, options),
            this.jobRepository.countJobsByUser(options)
        ]);
        return { jobs, total };
    }
    async findOne(user, id) {
        const job = await this.jobRepository.findJobById(user, id);
        if (!job) {
            throw new common_1.NotFoundException(`Job with ID ${id} not found`);
        }
        return job;
    }
    async create(user, createJobDto) {
        if (user.role === 'client' && !user.clientId) {
            throw new common_1.ForbiddenException('Client users must have a clientId assigned');
        }
        const jobData = {
            ...createJobDto,
            status: (createJobDto.status || job_entity_1.JobStatus.DRAFT),
            type: createJobDto.type || job_entity_1.JobType.FULL_TIME,
        };
        if (user.role === 'client') {
            jobData.clientId = user.clientId;
        }
        return this.jobRepository.createJob(user, jobData);
    }
    async update(user, id, updateJobDto) {
        const existingJob = await this.findOne(user, id);
        if (existingJob.status === job_entity_1.JobStatus.PUBLISHED && updateJobDto.status === job_entity_1.JobStatus.DRAFT) {
            throw new common_1.ForbiddenException('Cannot revert published job to draft status');
        }
        return this.jobRepository.updateJob(user, id, updateJobDto);
    }
    async remove(user, id) {
        const job = await this.findOne(user, id);
        if (job.status === job_entity_1.JobStatus.PUBLISHED) {
            throw new common_1.ForbiddenException('Cannot delete a published job. Please close it first.');
        }
        await this.jobRepository.deleteJob(user, id);
    }
    async publish(user, id) {
        const job = await this.findOne(user, id);
        if (job.status !== job_entity_1.JobStatus.DRAFT) {
            throw new common_1.ForbiddenException('Only draft jobs can be published');
        }
        return this.jobRepository.updateJob(user, id, { status: job_entity_1.JobStatus.PUBLISHED });
    }
    async close(user, id) {
        const job = await this.findOne(user, id);
        if (job.status === job_entity_1.JobStatus.CLOSED) {
            throw new common_1.ForbiddenException('Job is already closed');
        }
        return this.jobRepository.updateJob(user, id, { status: job_entity_1.JobStatus.CLOSED });
    }
    async findByStatus(user, status) {
        return this.jobRepository.findJobsByStatus(user, status);
    }
    async findByClient(user, clientId) {
        if (user.role === 'client' && clientId !== user.clientId) {
            throw new common_1.ForbiddenException('Cannot view jobs for other clients');
        }
        return this.jobRepository.findJobsByClient(user, clientId);
    }
    async getStatistics(user) {
        const [total, draft, published, closed, archived] = await Promise.all([
            this.jobRepository.countJobsByUser(user),
            this.jobRepository.countJobsByUser(user, { where: { status: job_entity_1.JobStatus.DRAFT } }),
            this.jobRepository.countJobsByUser(user, { where: { status: job_entity_1.JobStatus.PUBLISHED } }),
            this.jobRepository.countJobsByUser(user, { where: { status: job_entity_1.JobStatus.CLOSED } }),
            this.jobRepository.countJobsByUser(user, { where: { status: job_entity_1.JobStatus.ARCHIVED } }),
        ]);
        return { total, draft, published, closed, archived };
    }
    async search(user, query, filters) {
        const options = {
            relations: ['client'],
            order: { createdAt: 'DESC' },
            where: [
                { title: `ILIKE :query` },
                { description: `ILIKE :query` },
                { requirements: `ILIKE :query` },
                { skills: `ILIKE :query` },
            ],
        };
        if (filters?.status) {
            options.where = options.where.map(condition => ({
                ...condition,
                status: filters.status,
            }));
        }
        if (filters?.type) {
            options.where = options.where.map(condition => ({
                ...condition,
                type: filters.type,
            }));
        }
        if (filters?.limit) {
            options.take = filters.limit;
        }
        if (filters?.offset) {
            options.skip = filters.offset;
        }
        const [jobs, total] = await Promise.all([
            this.jobRepository.findJobsByUser(user, options),
            this.jobRepository.countJobsByUser(options)
        ]);
        return { jobs, total };
    }
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [job_repository_1.JobRepository])
], JobsService);
//# sourceMappingURL=jobs.service.js.map