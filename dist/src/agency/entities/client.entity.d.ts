import { Agency } from './agency.entity';
import { Job } from './job.entity';
export declare class Client {
    id: number;
    companyName: string;
    email?: string;
    agency: Agency;
    jobs: Job[];
}
