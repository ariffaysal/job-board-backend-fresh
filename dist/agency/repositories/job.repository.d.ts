import { Repository, FindManyOptions } from 'typeorm';
import { Job } from '../entities/job.entity';
import { BaseRepository } from '../../common/repositories/base.repository';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
export declare class JobRepository extends BaseRepository<Job> {
    constructor(repository: Repository<Job>);
    protected getTenantField(): string;
    findJobsByUser(user: CurrentUser, options?: FindManyOptions<Job>): Promise<Job[]>;
    findJobById(user: CurrentUser, jobId: number): Promise<Job | null>;
    countJobsByUser(user: CurrentUser, options?: FindManyOptions<Job>): Promise<number>;
    findJobsByStatus(user: CurrentUser, status: string): Promise<Job[]>;
    findJobsByClient(user: CurrentUser, clientId: number): Promise<Job[]>;
    createJob(user: CurrentUser, jobData: Partial<Job>): Promise<Job>;
    updateJob(user: CurrentUser, jobId: number, updateData: Partial<Job>): Promise<Job>;
    deleteJob(user: CurrentUser, jobId: number): Promise<void>;
}
