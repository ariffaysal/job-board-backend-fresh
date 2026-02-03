import { Job } from './job.entity';
export type ApplicationStatus = 'applied' | 'shortlisted' | 'rejected' | 'hired';
export declare class Application {
    id: number;
    candidateName: string;
    candidateEmail: string;
    coverLetter?: string;
    resume?: string;
    status: ApplicationStatus;
    appliedAt: Date;
    job: Job;
}
