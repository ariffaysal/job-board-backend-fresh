import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Agency)
    private agencyRepo: Repository<Agency>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(name: string, email: string, password: string) {
    const existing = await this.agencyRepo.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const bcryptRounds = parseInt(this.configService.get<string>('BCRYPT_ROUNDS') || '10');
    const hashedPassword = await bcrypt.hash(password, bcryptRounds);

    const agency = this.agencyRepo.create({
      name,
      email,
      password: hashedPassword,
    });

    const savedAgency = await this.agencyRepo.save(agency);

    const payload: JwtPayload = {
      sub: savedAgency.id,
      email: savedAgency.email,
      name: savedAgency.name,
      role: 'agency',
      agencyId: savedAgency.id,
    };

    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: savedAgency.id,
        name: savedAgency.name,
        email: savedAgency.email,
        role: 'agency',
        agencyId: savedAgency.id,
      },
    };
  }

  async login(email: string, password: string) {
    const agency = await this.agencyRepo.findOne({ where: { email } });

    if (!agency) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, agency.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: agency.id,
      email: agency.email,
      name: agency.name,
      role: 'agency',
      agencyId: agency.id,
    };

    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: agency.id,
        name: agency.name,
        email: agency.email,
        role: 'agency',
        agencyId: agency.id,
      },
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const agency = await this.agencyRepo.findOne({ where: { email } });
    
    if (agency && await bcrypt.compare(password, agency.password)) {
      const { password, ...result } = agency;
      return result;
    }
    
    return null;
  }
}