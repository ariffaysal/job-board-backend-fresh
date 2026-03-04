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
var Job_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Job = exports.JobExperienceLevel = exports.JobStatus = exports.JobType = void 0;
const typeorm_1 = require("typeorm");
const client_entity_1 = require("./client.entity");
const application_entity_1 = require("./application.entity");
const slug_service_1 = require("../../common/services/slug.service");
var JobType;
(function (JobType) {
    JobType["FULL_TIME"] = "full-time";
    JobType["PART_TIME"] = "part-time";
    JobType["CONTRACT"] = "contract";
    JobType["FREELANCE"] = "freelance";
    JobType["INTERNSHIP"] = "internship";
    JobType["REMOTE"] = "remote";
    JobType["HYBRID"] = "hybrid";
})(JobType || (exports.JobType = JobType = {}));
var JobStatus;
(function (JobStatus) {
    JobStatus["DRAFT"] = "draft";
    JobStatus["PUBLISHED"] = "published";
    JobStatus["CLOSED"] = "closed";
    JobStatus["ARCHIVED"] = "archived";
    JobStatus["PAUSED"] = "paused";
})(JobStatus || (exports.JobStatus = JobStatus = {}));
var JobExperienceLevel;
(function (JobExperienceLevel) {
    JobExperienceLevel["ENTRY"] = "entry";
    JobExperienceLevel["MID"] = "mid";
    JobExperienceLevel["SENIOR"] = "senior";
    JobExperienceLevel["LEAD"] = "lead";
    JobExperienceLevel["EXECUTIVE"] = "executive";
})(JobExperienceLevel || (exports.JobExperienceLevel = JobExperienceLevel = {}));
let Job = Job_1 = class Job {
    async generateSlug() {
        if (!this.slug) {
            const companyName = this.client?.companyName || 'company';
            this.slug = await Job_1.slugService.generateUniqueSlug(this.title, companyName, async (slug) => {
                return false;
            });
            this.metaDescription = Job_1.slugService.generateMetaDescription(this.slug);
            const keywords = Job_1.slugService.extractKeywords(this.slug);
            this.metaKeywords = keywords.join(', ');
        }
    }
    generateMetaTags() {
        if (!this.metaDescription) {
            this.metaDescription = Job_1.slugService.generateMetaDescription(this.slug || this.title);
        }
    }
};
exports.Job = Job;
Job.slugService = new slug_service_1.SlugService();
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Job.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Job.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, unique: true }),
    __metadata("design:type", String)
], Job.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Job.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 500, nullable: true }),
    __metadata("design:type", String)
], Job.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Job.prototype, "salary", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        enum: JobType,
        default: JobType.FULL_TIME
    }),
    __metadata("design:type", String)
], Job.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        enum: JobStatus,
        default: JobStatus.DRAFT
    }),
    __metadata("design:type", String)
], Job.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        enum: JobExperienceLevel,
        nullable: true
    }),
    __metadata("design:type", String)
], Job.prototype, "experienceLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 1000, nullable: true }),
    __metadata("design:type", String)
], Job.prototype, "requirements", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 500, nullable: true }),
    __metadata("design:type", String)
], Job.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 1000, nullable: true }),
    __metadata("design:type", String)
], Job.prototype, "benefits", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Job.prototype, "workSchedule", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 1000, nullable: true }),
    __metadata("design:type", String)
], Job.prototype, "skills", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Job.prototype, "isRemote", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Job.prototype, "clientId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => client_entity_1.Client, (client) => client.jobs, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", client_entity_1.Client)
], Job.prototype, "client", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => application_entity_1.Application, (application) => application.job, { cascade: true }),
    __metadata("design:type", Array)
], Job.prototype, "applications", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 160, nullable: true }),
    __metadata("design:type", String)
], Job.prototype, "metaDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 500, nullable: true }),
    __metadata("design:type", String)
], Job.prototype, "metaKeywords", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Job.prototype, "isFeatured", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Job.prototype, "applicationDeadline", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Job.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Job.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], Job.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Job.prototype, "attachment", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Job.prototype, "generateSlug", null);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Job.prototype, "generateMetaTags", null);
exports.Job = Job = Job_1 = __decorate([
    (0, typeorm_1.Entity)()
], Job);
//# sourceMappingURL=job.entity.js.map