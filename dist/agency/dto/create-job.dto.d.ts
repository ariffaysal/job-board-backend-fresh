export declare enum JobType {
    FULL_TIME = "full-time",
    PART_TIME = "part-time",
    CONTRACT = "contract",
    FREELANCE = "freelance",
    INTERNSHIP = "internship"
}
export declare enum JobStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    CLOSED = "closed",
    ARCHIVED = "archived"
}
export declare class CreateJobDto {
    title: string;
    description: string;
    location?: string;
    salary?: number;
    type?: JobType;
    status?: JobStatus;
    requirements?: string;
    department?: string;
}
