import { Job } from '../entities/job.entity';
import { JobRepository } from '../repositories/job.repository';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateJobDto } from '../dto/create-job.dto';
import { UpdateJobDto } from '../dto/update-job.dto';
import { JobStatus, JobType, JobExperienceLevel } from '../entities/job.entity';
export declare class JobsService {
    private readonly jobRepository;
    constructor(jobRepository: JobRepository);
    findAll(user: CurrentUser, filters?: {
        status?: JobStatus;
        type?: JobType;
        experienceLevel?: JobExperienceLevel;
        clientId?: number;
        limit?: number;
        offset?: number;
    }): Promise<{
        jobs: Job[];
        total: number;
    }>;
    findOne(user: CurrentUser, id: number): Promise<Job>;
    create(user: CurrentUser, createJobDto: CreateJobDto): Promise<Job>;
    update(user: CurrentUser, id: number, updateJobDto: UpdateJobDto): Promise<Job>;
    remove(user: CurrentUser, id: number): Promise<void>;
    publish(user: CurrentUser, id: number): Promise<Job>;
    close(user: CurrentUser, id: number): Promise<Job>;
    findByStatus(user: CurrentUser, status: JobStatus): Promise<Job[]>;
    findByClient(user: CurrentUser, clientId: number): Promise<Job[]>;
    getStatistics(user: CurrentUser): Promise<{
        total: number;
        draft: number;
        published: number;
        closed: number;
        archived: number;
    }>;
    search(user: CurrentUser, query: string, filters?: {
        status?: JobStatus;
        type?: JobType;
        limit?: number;
        offset?: number;
    }): Promise<{
        jobs: Job[];
        total: number;
    }>;
}
