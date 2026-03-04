import { Client } from './client.entity';
import { Application } from './application.entity';
export declare enum JobType {
    FULL_TIME = "full-time",
    PART_TIME = "part-time",
    CONTRACT = "contract",
    FREELANCE = "freelance",
    INTERNSHIP = "internship",
    REMOTE = "remote",
    HYBRID = "hybrid"
}
export declare enum JobStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
    CLOSED = "closed",
    ARCHIVED = "archived",
    PAUSED = "paused"
}
export declare enum JobExperienceLevel {
    ENTRY = "entry",
    MID = "mid",
    SENIOR = "senior",
    LEAD = "lead",
    EXECUTIVE = "executive"
}
export declare class Job {
    id: number;
    title: string;
    slug: string;
    description: string;
    location?: string;
    salary?: number;
    type: JobType;
    status: JobStatus;
    experienceLevel?: JobExperienceLevel;
    requirements?: string;
    department?: string;
    benefits?: string;
    workSchedule?: string;
    skills?: string;
    isRemote: boolean;
    clientId: number;
    client: Client;
    applications: Application[];
    metaDescription?: string;
    metaKeywords?: string;
    isFeatured: boolean;
    applicationDeadline?: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    attachment: string;
    private static slugService;
    generateSlug(): Promise<void>;
    generateMetaTags(): void;
}
