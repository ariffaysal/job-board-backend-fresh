import { JobType, JobStatus, JobExperienceLevel } from '../entities/job.entity';
export declare class UpdateJobDto {
    title?: string;
    description?: string;
    location?: string;
    salary?: number;
    type?: JobType;
    status?: JobStatus;
    experienceLevel?: JobExperienceLevel;
    requirements?: string;
    department?: string;
    benefits?: string;
    workSchedule?: string;
    skills?: string;
    isRemote?: boolean;
}
