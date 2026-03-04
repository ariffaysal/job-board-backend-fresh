import { Job } from './job.entity';
export declare enum ApplicationStatus {
    APPLIED = "applied",
    SHORTLISTED = "shortlisted",
    REJECTED = "rejected",
    HIRED = "hired",
    WITHDRAWN = "withdrawn",
    INTERVIEW_SCHEDULED = "interview-scheduled",
    OFFER_EXTENDED = "offer-extended"
}
export declare enum ApplicationSource {
    WEBSITE = "website",
    LINKEDIN = "linkedin",
    REFERRAL = "referral",
    EMAIL = "email",
    OTHER = "other"
}
export declare class Application {
    id: number;
    candidateName: string;
    candidateEmail: string;
    coverLetter?: string;
    resume?: string;
    status: ApplicationStatus;
    source: ApplicationSource;
    phone?: string;
    currentJobTitle?: string;
    currentCompany?: string;
    linkedInProfile?: string;
    portfolioUrl?: string;
    yearsOfExperience?: number;
    expectedSalary?: string;
    currentSalary?: number;
    notes?: string;
    skills?: string;
    interviewSchedule?: any;
    rejectionReason?: string;
    jobId: number;
    job: Job;
    appliedAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
