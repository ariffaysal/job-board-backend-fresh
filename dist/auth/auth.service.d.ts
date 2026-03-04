import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Agency } from '../agency/entities/agency.entity';
export type UserRole = 'agency' | 'client' | 'admin';
export interface JwtPayload {
    sub: number;
    email: string;
    name: string;
    role: UserRole;
    agencyId: number;
    clientId?: number;
}
export declare class AuthService {
    private agencyRepo;
    private jwtService;
    private configService;
    constructor(agencyRepo: Repository<Agency>, jwtService: JwtService, configService: ConfigService);
    register(name: string, email: string, password: string): Promise<{
        access_token: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
            agencyId: number;
        };
    }>;
    login(email: string, password: string): Promise<{
        access_token: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
            agencyId: number;
        };
    }>;
    validateUser(email: string, password: string): Promise<any>;
}
