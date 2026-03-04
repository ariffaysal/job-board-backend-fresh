export declare enum ApplicationStatus {
    APPLIED = "applied",
    SHORTLISTED = "shortlisted",
    REJECTED = "rejected",
    HIRED = "hired"
}
export declare class CreateApplicationDto {
    candidateName: string;
    candidateEmail: string;
    coverLetter?: string;
    phone?: string;
    currentJobTitle?: string;
    currentCompany?: string;
    linkedInProfile?: string;
    portfolioUrl?: string;
    status?: ApplicationStatus;
    yearsOfExperience?: number;
    expectedSalary?: string;
}
