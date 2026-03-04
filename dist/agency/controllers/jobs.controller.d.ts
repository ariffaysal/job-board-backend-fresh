import { JobsService } from '../services/jobs.service';
import { CreateJobDto } from '../dto/create-job.dto';
import { UpdateJobDto } from '../dto/update-job.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JobStatus, JobType, JobExperienceLevel } from '../entities/job.entity';
export declare class JobsController {
    private readonly jobsService;
    constructor(jobsService: JobsService);
    create(user: CurrentUser, createJobDto: CreateJobDto): Promise<import("../entities/job.entity").Job>;
    findAll(user: CurrentUser, status?: JobStatus, type?: JobType, experienceLevel?: JobExperienceLevel, clientId?: number, limit?: number, offset?: number): Promise<{
        jobs: import("../entities/job.entity").Job[];
        total: number;
    }>;
    search(user: CurrentUser, query: string, status?: JobStatus, type?: JobType, limit?: number, offset?: number): Promise<{
        jobs: import("../entities/job.entity").Job[];
        total: number;
    }>;
    getStatistics(user: CurrentUser): Promise<{
        total: number;
        draft: number;
        published: number;
        closed: number;
        archived: number;
    }>;
    findByStatus(user: CurrentUser, status: JobStatus): Promise<import("../entities/job.entity").Job[]>;
    findByClient(user: CurrentUser, clientId: number): Promise<import("../entities/job.entity").Job[]>;
    findOne(user: CurrentUser, id: number): Promise<import("../entities/job.entity").Job>;
    update(user: CurrentUser, id: number, updateJobDto: UpdateJobDto): Promise<import("../entities/job.entity").Job>;
    publish(user: CurrentUser, id: number): Promise<import("../entities/job.entity").Job>;
    close(user: CurrentUser, id: number): Promise<import("../entities/job.entity").Job>;
    remove(user: CurrentUser, id: number): Promise<void>;
}
