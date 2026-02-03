import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Agency } from '../agency/entities/agency.entity';
export declare class AuthService {
    private agencyRepo;
    private jwtService;
    constructor(agencyRepo: Repository<Agency>, jwtService: JwtService);
    register(name: string, email: string, password: string): Promise<{
        access_token: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    }>;
    login(email: string, password: string): Promise<{
        access_token: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    }>;
}
