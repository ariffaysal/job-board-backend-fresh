import { Repository } from 'typeorm';
import { Agency } from './entities/agency.entity';
import { Client } from './entities/client.entity';
import { Job } from './entities/job.entity';
import { Application } from './entities/application.entity';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { CreateApplicationDto } from './dto/create-application.dto';
export declare class AgencyService {
    private agencyRepo;
    private clientRepo;
    private jobRepo;
    private appRepo;
    private jwtService;
    jobRepository: any;
    constructor(agencyRepo: Repository<Agency>, clientRepo: Repository<Client>, jobRepo: Repository<Job>, appRepo: Repository<Application>, jwtService: JwtService);
    createAgency(dto: CreateAgencyDto): Promise<{
        id: number;
        email: string;
        name: string;
        clients: Client[];
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
    }>;
    getAllAgencies(): Promise<{
        id: number;
        email: string;
        name: string;
        clients: Client[];
    }[]>;
    getAgencyById(id: number): Promise<{
        id: number;
        email: string;
        name: string;
        clients: Client[];
    }>;
    updateAgency(id: number, dto: Partial<CreateAgencyDto>): Promise<{
        id: number;
        email: string;
        name: string;
        clients: Client[];
    }>;
    deleteAgency(id: number): Promise<Agency>;
    addClient(agencyId: number, dto: any): Promise<Client[]>;
    getClientsByAgency(agencyId: number): Promise<{
        id: number;
        companyName: string;
        jobs: {
            id: number;
            title: string;
            description: string;
            attachment: string;
        }[];
    }[]>;
    addJob(clientId: number, dto: any, file?: Express.Multer.File): Promise<Job[]>;
    getJobById(id: number): Promise<{
        id: number;
        title: string;
        description: string;
        location: any;
        salary: any;
        attachment: string;
        createdAt: any;
    }>;
    getJobsByClient(clientId: number): Promise<{
        id: number;
        title: string;
        description: string;
        attachment: string;
    }[]>;
    deleteJob(jobId: number): Promise<Job>;
    applyToJob(jobId: number, dto: CreateApplicationDto, resume?: Express.Multer.File): Promise<Application>;
    getApplicationsByJob(jobId: number): Promise<Application[]>;
    updateApplication(id: number, dto: Partial<any>): Promise<Application>;
    deleteApplication(id: number): Promise<Application>;
}
