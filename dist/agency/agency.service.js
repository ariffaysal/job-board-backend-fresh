"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgencyService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const agency_entity_1 = require("./entities/agency.entity");
const client_entity_1 = require("./entities/client.entity");
const job_entity_1 = require("./entities/job.entity");
const application_entity_1 = require("./entities/application.entity");
const jwt_1 = require("@nestjs/jwt");
const bcrypt_util_1 = require("./utils/bcrypt.util");
let AgencyService = class AgencyService {
    constructor(agencyRepo, clientRepo, jobRepo, appRepo, jwtService) {
        this.agencyRepo = agencyRepo;
        this.clientRepo = clientRepo;
        this.jobRepo = jobRepo;
        this.appRepo = appRepo;
        this.jwtService = jwtService;
    }
    async createAgency(dto) {
        const existing = await this.agencyRepo.findOneBy({ email: dto.email });
        if (existing) {
            throw new common_1.HttpException('Email already exists', common_1.HttpStatus.CONFLICT);
        }
        const hashedPassword = await (0, bcrypt_util_1.hashPassword)(dto.password);
        const agency = this.agencyRepo.create({ ...dto, password: hashedPassword });
        const saved = await this.agencyRepo.save(agency);
        const { password, ...safeAgency } = saved;
        return safeAgency;
    }
    async login(dto) {
        const agency = await this.agencyRepo.findOneBy({ email: dto.email });
        if (!agency)
            throw new common_1.HttpException('Invalid credentials', common_1.HttpStatus.UNAUTHORIZED);
        const isMatch = await (0, bcrypt_util_1.comparePasswords)(dto.password, agency.password);
        if (!isMatch)
            throw new common_1.HttpException('Invalid credentials', common_1.HttpStatus.UNAUTHORIZED);
        const payload = { id: agency.id, email: agency.email };
        const token = this.jwtService.sign(payload);
        return { access_token: token };
    }
    async getAllAgencies() {
        const agencies = await this.agencyRepo.find({ relations: ['clients'] });
        return agencies.map(agency => {
            const { password, ...safeAgency } = agency;
            return safeAgency;
        });
    }
    async getAgencyById(id) {
        const agency = await this.agencyRepo.findOne({ where: { id }, relations: ['clients'] });
        if (!agency)
            throw new common_1.HttpException('Agency not found', common_1.HttpStatus.NOT_FOUND);
        const { password, ...safeAgency } = agency;
        return safeAgency;
    }
    async updateAgency(id, dto) {
        const agency = await this.agencyRepo.findOneBy({ id });
        if (!agency)
            throw new common_1.HttpException('Agency not found', common_1.HttpStatus.NOT_FOUND);
        if (dto.password)
            dto.password = await (0, bcrypt_util_1.hashPassword)(dto.password);
        Object.assign(agency, dto);
        const updated = await this.agencyRepo.save(agency);
        const { password, ...safeAgency } = updated;
        return safeAgency;
    }
    async deleteAgency(id) {
        const agency = await this.agencyRepo.findOneBy({ id });
        if (!agency)
            throw new common_1.HttpException('Agency not found', common_1.HttpStatus.NOT_FOUND);
        return this.agencyRepo.remove(agency);
    }
    async addClient(agencyId, dto) {
        const agency = await this.agencyRepo.findOneBy({ id: agencyId });
        if (!agency)
            throw new common_1.HttpException('Agency not found', common_1.HttpStatus.NOT_FOUND);
        const client = this.clientRepo.create({ ...dto, agency });
        const saved = await this.clientRepo.save(client);
        if (dto.email) {
            try {
                await sendEmail(dto.email, 'Added as client', `You were added to agency ${agency.name}`);
            }
            catch (err) {
                console.warn('Mail failed', err);
            }
        }
        return saved;
    }
    async getClientsByAgency(agencyId) {
        const clients = await this.clientRepo.find({
            where: { agency: { id: agencyId } },
            relations: ['jobs']
        });
        return clients.map(client => ({
            id: client.id,
            companyName: client.companyName,
            jobs: client.jobs.map(job => ({
                id: job.id,
                title: job.title,
                description: job.description,
                attachment: job.attachment,
            })),
        }));
    }
    async addJob(clientId, dto, file) {
        const client = await this.clientRepo.findOneBy({ id: clientId });
        if (!client)
            throw new common_1.HttpException('Client not found', common_1.HttpStatus.NOT_FOUND);
        const job = this.jobRepo.create({ ...dto, client, attachment: file?.filename });
        return this.jobRepo.save(job);
    }
    async getJobById(id) {
        const job = await this.jobRepo.findOne({
            where: { id },
            relations: ['client'],
        });
        if (!job) {
            throw new common_1.NotFoundException('Job not found');
        }
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
    async getJobsByClient(clientId) {
        const jobs = await this.jobRepo.find({
            where: { client: { id: clientId } },
            relations: ['applications']
        });
        return jobs.map(job => ({
            id: job.id,
            title: job.title,
            description: job.description,
            attachment: job.attachment,
        }));
    }
    async deleteJob(jobId) {
        const job = await this.jobRepo.findOneBy({ id: jobId });
        if (!job)
            throw new common_1.HttpException('Job not found', common_1.HttpStatus.NOT_FOUND);
        return this.jobRepo.remove(job);
    }
    async applyToJob(jobId, dto, resume) {
        const job = await this.jobRepo.findOne({ where: { id: jobId }, relations: ['client', 'client.agency'] });
        if (!job)
            throw new common_1.HttpException('Job not found', common_1.HttpStatus.NOT_FOUND);
        const application = this.appRepo.create({
            candidateName: dto.candidateName,
            candidateEmail: dto.candidateEmail,
            coverLetter: dto.coverLetter,
            resume: resume?.filename,
            job,
            status: 'applied',
        });
        const saved = await this.appRepo.save(application);
        if (job.client?.email) {
            try {
                await sendEmail(job.client.email, `New application for ${job.title}`, `Candidate ${dto.candidateName} applied for ${job.title}. Email: ${dto.candidateEmail}`);
            }
            catch (err) {
                console.warn('Mail failed', err);
            }
        }
        return saved;
    }
    async getApplicationsByJob(jobId) {
        const job = await this.jobRepo.findOne({ where: { id: jobId }, relations: ['client', 'client.agency'] });
        if (!job)
            throw new common_1.HttpException('Job not found', common_1.HttpStatus.NOT_FOUND);
        return this.appRepo.find({ where: { job: { id: jobId } } });
    }
    async updateApplication(id, dto) {
        const app = await this.appRepo.findOne({ where: { id }, relations: ['job', 'job.client'] });
        if (!app)
            throw new common_1.HttpException('Application not found', common_1.HttpStatus.NOT_FOUND);
        if (dto.status && dto.status !== app.status) {
            app.status = dto.status;
            if (dto.status === 'shortlisted' && app.candidateEmail) {
                try {
                    await sendEmail(app.candidateEmail, `Application Update: ${app.job.title}`, `Hi ${app.candidateName},\n\nYou have been shortlisted for ${app.job.title}. The client will contact you soon.`);
                }
                catch (err) {
                    console.warn('Mail failed', err);
                }
            }
        }
        if (dto.coverLetter !== undefined) {
            app.coverLetter = dto.coverLetter;
        }
        return this.appRepo.save(app);
    }
    async deleteApplication(id) {
        const app = await this.appRepo.findOne({ where: { id } });
        if (!app)
            throw new common_1.HttpException('Application not found', common_1.HttpStatus.NOT_FOUND);
        return this.appRepo.remove(app);
    }
};
exports.AgencyService = AgencyService;
exports.AgencyService = AgencyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(agency_entity_1.Agency)),
    __param(1, (0, typeorm_1.InjectRepository)(client_entity_1.Client)),
    __param(2, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __param(3, (0, typeorm_1.InjectRepository)(application_entity_1.Application)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], AgencyService);
function sendEmail(email, arg1, arg2) {
    throw new Error('Function not implemented.');
}
//# sourceMappingURL=agency.service.js.map