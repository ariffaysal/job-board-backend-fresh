import { AgencyService } from './agency.service';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { CreateJobDto } from './dto/create-job.dto';
import { LoginDto } from './dto/login.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
export declare class AgencyController {
    private readonly agencyService;
    constructor(agencyService: AgencyService);
    createAgency(dto: CreateAgencyDto): Promise<{
        id: number;
        email: string;
        name: string;
        clients: import("./entities/client.entity").Client[];
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
    }>;
    getAllAgencies(): Promise<{
        id: number;
        email: string;
        name: string;
        clients: import("./entities/client.entity").Client[];
    }[]>;
    getAgency(id: number): Promise<{
        id: number;
        email: string;
        name: string;
        clients: import("./entities/client.entity").Client[];
    }>;
    getClients(agencyId: number): Promise<{
        id: number;
        companyName: string;
        jobs: {
            id: number;
            title: string;
            description: string;
            attachment: string;
        }[];
    }[]>;
    getJobs(clientId: number): Promise<{
        id: number;
        title: string;
        description: string;
        attachment: string;
    }[]>;
    applyToJob(jobId: number, dto: CreateApplicationDto, resume?: Express.Multer.File): Promise<import("./entities/application.entity").Application>;
    updateAgency(id: number, dto: UpdateAgencyDto): Promise<{
        id: number;
        email: string;
        name: string;
        clients: import("./entities/client.entity").Client[];
    }>;
    deleteAgency(id: number): Promise<import("./entities/agency.entity").Agency>;
    addClient(agencyId: number, dto: CreateClientDto): Promise<import("./entities/client.entity").Client[]>;
    addJob(clientId: number, dto: CreateJobDto, file?: Express.Multer.File): Promise<import("./entities/job.entity").Job[]>;
    deleteJob(jobId: number): Promise<import("./entities/job.entity").Job>;
    getApplications(jobId: number): Promise<import("./entities/application.entity").Application[]>;
    getJob(id: string): Promise<{
        id: number;
        title: string;
        description: string;
        location: any;
        salary: any;
        attachment: string;
        createdAt: any;
    }>;
    updateApplication(id: number, dto: UpdateApplicationDto): Promise<import("./entities/application.entity").Application>;
    deleteApplication(id: number): Promise<import("./entities/application.entity").Application>;
}
