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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgencyController = void 0;
const common_1 = require("@nestjs/common");
const agency_service_1 = require("./agency.service");
const create_agency_dto_1 = require("./dto/create-agency.dto");
const update_agency_dto_1 = require("./dto/update-agency.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const platform_express_1 = require("@nestjs/platform-express");
const fileUpload_1 = require("./utils/fileUpload");
const agency_validation_pipe_1 = require("./pipes/agency-validation.pipe");
const create_client_dto_1 = require("./dto/create-client.dto");
const create_job_dto_1 = require("./dto/create-job.dto");
const login_dto_1 = require("./dto/login.dto");
const create_application_dto_1 = require("./dto/create-application.dto");
const update_application_dto_1 = require("./dto/update-application.dto");
let AgencyController = class AgencyController {
    constructor(agencyService) {
        this.agencyService = agencyService;
    }
    // ========== PUBLIC ROUTES (No authentication needed) ==========
    createAgency(dto) {
        return this.agencyService.createAgency(dto);
    }
    login(dto) {
        return this.agencyService.login(dto);
    }
    getAllAgencies() {
        return this.agencyService.getAllAgencies();
    }
    getAgency(id) {
        return this.agencyService.getAgencyById(id);
    }
    getClients(agencyId) {
        return this.agencyService.getClientsByAgency(agencyId);
    }
    getJobs(clientId) {
        return this.agencyService.getJobsByClient(clientId);
    }
    applyToJob(jobId, dto, resume) {
        return this.agencyService.applyToJob(jobId, dto, resume);
    }
    // ========== PROTECTED ROUTES (Authentication required) ==========
    updateAgency(id, dto) {
        return this.agencyService.updateAgency(id, dto);
    }
    //@Delete(':id')
    deleteAgency(id) {
        return this.agencyService.deleteAgency(id);
    }
    addClient(agencyId, dto) {
        return this.agencyService.addClient(agencyId, dto);
    }
    addJob(clientId, dto, file) {
        return this.agencyService.addJob(clientId, dto, file);
    }
    //  @UseGuards(JwtAuthGuard)
    deleteJob(jobId) {
        return this.agencyService.deleteJob(jobId);
    }
    //@UseGuards(JwtAuthGuard)
    getApplications(jobId) {
        return this.agencyService.getApplicationsByJob(jobId);
    }
    getJob(id) {
        const jobId = Number(id);
        if (isNaN(jobId))
            throw new common_1.BadRequestException('Job ID must be a number');
        return this.agencyService.getJobById(jobId);
    }
    updateApplication(id, dto) {
        return this.agencyService.updateApplication(id, dto);
    }
    deleteApplication(id) {
        return this.agencyService.deleteApplication(id);
    }
};
exports.AgencyController = AgencyController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new agency_validation_pipe_1.AgencyValidationPipe()),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_agency_dto_1.CreateAgencyDto]),
    __metadata("design:returntype", void 0)
], AgencyController.prototype, "createAgency", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.UsePipes)(new agency_validation_pipe_1.AgencyValidationPipe()),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", void 0)
], AgencyController.prototype, "login", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AgencyController.prototype, "getAllAgencies", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AgencyController.prototype, "getAgency", null);
__decorate([
    (0, common_1.Get)(':id/clients'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AgencyController.prototype, "getClients", null);
__decorate([
    (0, common_1.Get)('client/:clientId/jobs'),
    __param(0, (0, common_1.Param)('clientId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AgencyController.prototype, "getJobs", null);
__decorate([
    (0, common_1.Post)('job/:jobId/apply'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('resume', fileUpload_1.fileUploadOptions)),
    (0, common_1.UsePipes)(new agency_validation_pipe_1.AgencyValidationPipe()),
    __param(0, (0, common_1.Param)('jobId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_application_dto_1.CreateApplicationDto, typeof (_b = typeof Express !== "undefined" && (_a = Express.Multer) !== void 0 && _a.File) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], AgencyController.prototype, "applyToJob", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UsePipes)(new agency_validation_pipe_1.AgencyValidationPipe()),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_agency_dto_1.UpdateAgencyDto]),
    __metadata("design:returntype", void 0)
], AgencyController.prototype, "updateAgency", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AgencyController.prototype, "deleteAgency", null);
__decorate([
    (0, common_1.Post)(':id/client')
    // @UseGuards(JwtAuthGuard)
    ,
    (0, common_1.UsePipes)(new agency_validation_pipe_1.AgencyValidationPipe()),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_client_dto_1.CreateClientDto]),
    __metadata("design:returntype", void 0)
], AgencyController.prototype, "addClient", null);
__decorate([
    (0, common_1.Post)('client/:clientId/job')
    // @UseGuards(JwtAuthGuard)
    ,
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', fileUpload_1.fileUploadOptions)),
    (0, common_1.UsePipes)(new agency_validation_pipe_1.AgencyValidationPipe()),
    __param(0, (0, common_1.Param)('clientId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_job_dto_1.CreateJobDto, typeof (_d = typeof Express !== "undefined" && (_c = Express.Multer) !== void 0 && _c.File) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], AgencyController.prototype, "addJob", null);
__decorate([
    (0, common_1.Delete)('job/:jobId')
    //  @UseGuards(JwtAuthGuard)
    ,
    __param(0, (0, common_1.Param)('jobId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AgencyController.prototype, "deleteJob", null);
__decorate([
    (0, common_1.Get)('job/:jobId/applications')
    //@UseGuards(JwtAuthGuard)
    ,
    __param(0, (0, common_1.Param)('jobId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AgencyController.prototype, "getApplications", null);
__decorate([
    (0, common_1.Get)('job/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AgencyController.prototype, "getJob", null);
__decorate([
    (0, common_1.Patch)('application/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UsePipes)(new agency_validation_pipe_1.AgencyValidationPipe()),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_application_dto_1.UpdateApplicationDto]),
    __metadata("design:returntype", void 0)
], AgencyController.prototype, "updateApplication", null);
__decorate([
    (0, common_1.Delete)('application/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AgencyController.prototype, "deleteApplication", null);
exports.AgencyController = AgencyController = __decorate([
    (0, common_1.Controller)('agency'),
    __metadata("design:paramtypes", [agency_service_1.AgencyService])
], AgencyController);
//# sourceMappingURL=agency.controller.js.map