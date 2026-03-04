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
var NotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const email_template_service_1 = require("./email-template.service");
let NotificationService = NotificationService_1 = class NotificationService {
    constructor(configService, emailTemplateService) {
        this.configService = configService;
        this.emailTemplateService = emailTemplateService;
        this.logger = new common_1.Logger(NotificationService_1.name);
        const apiKey = this.configService.get('RESEND_API_KEY');
        if (apiKey) {
            this.logger.log('Resend initialized with API key');
        }
        else {
            this.logger.warn('RESEND_API_KEY not found in environment variables');
        }
    }
    async sendApplicationNotification(clientEmail, clientName, jobTitle, applicationData) {
        try {
            const subject = `New Application: ${applicationData.candidateName} for ${jobTitle}`;
            const html = this.emailTemplateService.generateApplicationNotificationTemplate({
                clientName,
                jobTitle,
                candidateName: applicationData.candidateName,
                candidateEmail: applicationData.candidateEmail,
                phone: applicationData.phone,
                coverLetter: applicationData.coverLetter,
                currentJobTitle: applicationData.currentJobTitle,
                yearsOfExperience: applicationData.yearsOfExperience,
                skills: applicationData.skills,
                dashboardUrl: `${this.configService.get('FRONTEND_URL')}/dashboard`,
            });
            const result = await this.sendEmail({
                to: clientEmail,
                subject,
                html,
            });
            return {
                success: true,
                messageId: result.id,
            };
        }
        catch (error) {
            this.logger.error('Failed to send application notification', error);
            return {
                success: false,
                error: error.message,
            };
        }
    }
    async sendApplicationStatusUpdate(candidateEmail, candidateName, jobTitle, companyName, newStatus, interviewDate, rejectionReason) {
        try {
            const subject = `Application Status Update: ${jobTitle} at ${companyName}`;
            const html = this.emailTemplateService.generateStatusUpdateTemplate({
                candidateName,
                jobTitle,
                companyName,
                newStatus,
                interviewDate,
                rejectionReason,
                dashboardUrl: `${this.configService.get('FRONTEND_URL')}/applications`,
            });
            const result = await this.sendEmail({
                to: candidateEmail,
                subject,
                html,
            });
            return {
                success: true,
                messageId: result.id,
            };
        }
        catch (error) {
            this.logger.error('Failed to send status update notification', error);
            return {
                success: false,
                error: error.message,
            };
        }
    }
    async sendWelcomeEmail(agencyEmail, agencyName) {
        try {
            const subject = 'Welcome to Job Board Platform!';
            const html = this.emailTemplateService.generateWelcomeTemplate({
                agencyName,
                dashboardUrl: `${this.configService.get('FRONTEND_URL')}/dashboard`,
            });
            const result = await this.sendEmail({
                to: agencyEmail,
                subject,
                html,
            });
            return {
                success: true,
                messageId: result.id,
            };
        }
        catch (error) {
            this.logger.error('Failed to send welcome email', error);
            return {
                success: false,
                error: error.message,
            };
        }
    }
    async sendJobPublishedNotification(clientEmail, clientName, jobTitle, jobSlug) {
        try {
            const subject = `Job Published: ${jobTitle}`;
            const html = this.emailTemplateService.generateJobPublishedTemplate({
                clientName,
                jobTitle,
                jobUrl: `${this.configService.get('FRONTEND_URL')}/jobs/${jobSlug}`,
                dashboardUrl: `${this.configService.get('FRONTEND_URL')}/dashboard`,
            });
            const result = await this.sendEmail({
                to: clientEmail,
                subject,
                html,
            });
            return {
                success: true,
                messageId: result.id,
            };
        }
        catch (error) {
            this.logger.error('Failed to send job published notification', error);
            return {
                success: false,
                error: error.message,
            };
        }
    }
    async sendEmail(options) {
        const fromEmail = this.configService.get('FROM_EMAIL') || 'noreply@jobboard.com';
        if (!this.resend) {
            this.logger.log('Mock email send:', {
                to: options.to,
                subject: options.subject,
                htmlLength: options.html?.length || 0,
            });
            return { id: 'mock-id-' + Date.now() };
        }
        const result = await this.resend.emails.send({
            from: fromEmail,
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text,
        });
        if (result.error) {
            throw new Error(`Resend API error: ${result.error.message}`);
        }
        return { id: result.id };
    }
    async sendBulkEmails(recipients, subject, html) {
        const results = {
            success: 0,
            failed: 0,
            errors: [],
        };
        const batchSize = 50;
        for (let i = 0; i < recipients.length; i += batchSize) {
            const batch = recipients.slice(i, i + batchSize);
            for (const email of batch) {
                try {
                    await this.sendEmail({
                        to: email,
                        subject,
                        html,
                    });
                    results.success++;
                }
                catch (error) {
                    results.failed++;
                    results.errors.push(`${email}: ${error.message}`);
                }
            }
            if (i + batchSize < recipients.length) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        return results;
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        email_template_service_1.EmailTemplateService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map