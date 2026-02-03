
import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agency } from './entities/agency.entity';
import { Client } from './entities/client.entity';
import { Job } from './entities/job.entity';
import { Application } from './entities/application.entity';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { hashPassword, comparePasswords } from './utils/bcrypt.util';
import { CreateApplicationDto } from './dto/create-application.dto';

@Injectable()
export class AgencyService {
  jobRepository: any;
  constructor(
    @InjectRepository(Agency) private agencyRepo: Repository<Agency>,
    @InjectRepository(Client) private clientRepo: Repository<Client>,
    @InjectRepository(Job) private jobRepo: Repository<Job>,
    @InjectRepository(Application) private appRepo: Repository<Application>,
    private jwtService: JwtService,
  ) {}

  // --- Agency CRUD & Auth ---
  async createAgency(dto: CreateAgencyDto) {
    const existing = await this.agencyRepo.findOneBy({ email: dto.email });
    if (existing) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }
    const hashedPassword = await hashPassword(dto.password);
    const agency = this.agencyRepo.create({ ...dto, password: hashedPassword });
    const saved = await this.agencyRepo.save(agency);
    
    // ✅ Remove password from response
    const { password, ...safeAgency } = saved;
    return safeAgency;
  }

  async login(dto: LoginDto) {
    const agency = await this.agencyRepo.findOneBy({ email: dto.email });
    if (!agency) throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);

    const isMatch = await comparePasswords(dto.password, agency.password);
    if (!isMatch) throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);

    const payload = { id: agency.id, email: agency.email };
    const token = this.jwtService.sign(payload);
    return { access_token: token };
  }

  async getAllAgencies() {
    const agencies = await this.agencyRepo.find({ relations: ['clients'] });
    
    // ✅ Remove password from all agencies
    return agencies.map(agency => {
      const { password, ...safeAgency } = agency;
      return safeAgency;
    });
  }

  async getAgencyById(id: number) {
    const agency = await this.agencyRepo.findOne({ where: { id }, relations: ['clients'] });
    if (!agency) throw new HttpException('Agency not found', HttpStatus.NOT_FOUND);
    
    // ✅ Remove password from response
    const { password, ...safeAgency } = agency;
    return safeAgency;
  }

  async updateAgency(id: number, dto: Partial<CreateAgencyDto>) {
    const agency = await this.agencyRepo.findOneBy({ id });
    if (!agency) throw new HttpException('Agency not found', HttpStatus.NOT_FOUND);
    if (dto.password) dto.password = await hashPassword(dto.password);
    Object.assign(agency, dto);
    const updated = await this.agencyRepo.save(agency);
    
    // ✅ Remove password from response
    const { password, ...safeAgency } = updated;
    return safeAgency;
  }

  async deleteAgency(id: number) {
    const agency = await this.agencyRepo.findOneBy({ id });
    if (!agency) throw new HttpException('Agency not found', HttpStatus.NOT_FOUND);
    return this.agencyRepo.remove(agency);
  }

  async addClient(agencyId: number, dto: any) {
    const agency = await this.agencyRepo.findOneBy({ id: agencyId });
    if (!agency) throw new HttpException('Agency not found', HttpStatus.NOT_FOUND);
    const client = this.clientRepo.create({ ...dto, agency });
    const saved = await this.clientRepo.save(client);

    if ((dto as any).email) {
      try {
        await sendEmail((dto as any).email, 'Added as client', `You were added to agency ${agency.name}`);
      } catch (err) {
        console.warn('Mail failed', err);
      }
    }

    return saved;
  }

  async getClientsByAgency(agencyId: number) {
    const clients = await this.clientRepo.find({ 
      where: { agency: { id: agencyId } }, 
      relations: ['jobs'] 
    });
    
    // ✅ Return only public client info (no email, no contact details)
    return clients.map(client => ({
      id: client.id,
      companyName: client.companyName,
      jobs: client.jobs.map(job => ({
        id: job.id,
        title: job.title,
        description: job.description,
        attachment: job.attachment,
        // Don't include applications in public view
      })),
    }));
  }

  async addJob(clientId: number, dto: any, file?: Express.Multer.File) {
    const client = await this.clientRepo.findOneBy({ id: clientId });
    if (!client) throw new HttpException('Client not found', HttpStatus.NOT_FOUND);
    const job = this.jobRepo.create({ ...dto, client, attachment: file?.filename });
    return this.jobRepo.save(job);
  }

async getJobById(id: number) {
  const job = await this.jobRepo.findOne({
    where: { id },
    relations: ['client'], // if you want client info
  });
  if (!job) {
    throw new NotFoundException('Job not found');
  }

  // Only expose public info
  return {
    id: job.id,
    title: job.title,
    description: job.description,
    location: job.location,
    salary: job.salary,
    attachment: job.attachment,
    createdAt: job.createdAt,
  };
}




  async getJobsByClient(clientId: number) {
    const jobs = await this.jobRepo.find({ 
      where: { client: { id: clientId } }, 
      relations: ['applications'] 
    });
    
    // ✅ Return only public job info (no applications, no candidate data)
    return jobs.map(job => ({
      id: job.id,
      title: job.title,
      description: job.description,
      attachment: job.attachment,
      // Don't expose applications count or details publicly
    }));
  }

  async deleteJob(jobId: number) {
    const job = await this.jobRepo.findOneBy({ id: jobId });
    if (!job) throw new HttpException('Job not found', HttpStatus.NOT_FOUND);
    return this.jobRepo.remove(job);
  }

  // ---------------------------
  // APPLICATIONS
  // ---------------------------

  async applyToJob(jobId: number, dto: CreateApplicationDto, resume?: Express.Multer.File) {
    const job = await this.jobRepo.findOne({ where: { id: jobId }, relations: ['client', 'client.agency'] });
    if (!job) throw new HttpException('Job not found', HttpStatus.NOT_FOUND);

    const application = this.appRepo.create({
      candidateName: dto.candidateName,
      candidateEmail: dto.candidateEmail,
      coverLetter: dto.coverLetter,
      resume: resume?.filename,
      job,
      status: 'applied',
    });

    const saved = await this.appRepo.save(application);

    // Notify client (if client email exists)
    if (job.client?.email) {
      try {
        await sendEmail(
          job.client.email,
          `New application for ${job.title}`,
          `Candidate ${dto.candidateName} applied for ${job.title}. Email: ${dto.candidateEmail}`,
        );
      } catch (err) {
        console.warn('Mail failed', err);
      }
    }

    return saved;
  }

  async getApplicationsByJob(jobId: number) {
    const job = await this.jobRepo.findOne({ where: { id: jobId }, relations: ['client', 'client.agency'] });
    if (!job) throw new HttpException('Job not found', HttpStatus.NOT_FOUND);

    // 🔒 This is protected route - return full application data
    return this.appRepo.find({ where: { job: { id: jobId } } });
  }

  async updateApplication(id: number, dto: Partial<any>) {
    const app = await this.appRepo.findOne({ where: { id }, relations: ['job', 'job.client'] });
    if (!app) throw new HttpException('Application not found', HttpStatus.NOT_FOUND);

    if (dto.status && dto.status !== app.status) {
      app.status = dto.status;
      // If shortlisted, notify candidate by email if we have candidateEmail
      if (dto.status === 'shortlisted' && app.candidateEmail) {
        try {
          await sendEmail(
            app.candidateEmail,
            `Application Update: ${app.job.title}`,
            `Hi ${app.candidateName},\n\nYou have been shortlisted for ${app.job.title}. The client will contact you soon.`,
          );
        } catch (err) {
          console.warn('Mail failed', err);
        }
      }
    }

    if (dto.coverLetter !== undefined) {
      app.coverLetter = dto.coverLetter;
    }

    return this.appRepo.save(app);
  }

  async deleteApplication(id: number) {
    const app = await this.appRepo.findOne({ where: { id } });
    if (!app) throw new HttpException('Application not found', HttpStatus.NOT_FOUND);
    return this.appRepo.remove(app);
  }
}
function sendEmail(email: any, arg1: string, arg2: string) {
  throw new Error('Function not implemented.');
}

