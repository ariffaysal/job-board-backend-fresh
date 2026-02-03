import { Client } from './client.entity';
import { Application } from './application.entity';
export declare class Job {
    id: number;
    title: string;
    description: string;
    attachment?: string;
    client: Client;
    applications: Application[];
    location: any;
    salary: any;
    createdAt: any;
}
