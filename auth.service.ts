import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Agency } from '../agency/entities/agency.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Agency)
    private agencyRepo: Repository<Agency>,
    private jwtService: JwtService,
  ) {}

  async register(name: string, email: string, password: string) {
    console.log('🔵 AUTH: Registering new agency:', email);

    const existing = await this.agencyRepo.findOne({ where: { email } });
    if (existing) {
      console.error('❌ AUTH: Email already exists');
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('🔵 AUTH: Password hashed');

    const agency = this.agencyRepo.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.agencyRepo.save(agency);
    console.log('✅ AUTH: Agency created with ID:', agency.id);

    const payload = { 
      sub: agency.id, 
      email: agency.email,
      name: agency.name,
      role: 'agency'
    };
    const access_token = this.jwtService.sign(payload);

    console.log('✅ AUTH: Token created');

    return {
      access_token,
      user: {  // ✅ Changed from 'agency' to 'user'
        id: agency.id,
        name: agency.name,
        email: agency.email,
        role: 'agency',  // ✅ Added role
      },
    };
  }

  async login(email: string, password: string) {
    console.log('🔵 AUTH: Login attempt for:', email);

    const agency = await this.agencyRepo.findOne({ where: { email } });

    if (!agency) {
      console.error('❌ AUTH: Agency not found');
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log('🔵 AUTH: Agency found:', agency.name);

    const isPasswordValid = await bcrypt.compare(password, agency.password);

    if (!isPasswordValid) {
      console.error('❌ AUTH: Invalid password');
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log('✅ AUTH: Password valid');

    const payload = { 
      sub: agency.id, 
      email: agency.email,
      name: agency.name,
      role: 'agency'
    };
    const access_token = this.jwtService.sign(payload);

    console.log('✅ AUTH: Token created:', access_token.substring(0, 30) + '...');

    return {
      access_token,
      user: {  // ✅ Changed from 'agency' to 'user'
        id: agency.id,
        name: agency.name,
        email: agency.email,
        role: 'agency',  // ✅ Added role
      },
    };
  }
}