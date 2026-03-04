import { ConfigService } from '@nestjs/config';
import { EmailTemplateService } from './email-template.service';
export declare class NotificationService {
    private readonly configService;
    private readonly emailTemplateService;
    private readonly logger;
    private resend;
    constructor(configService: ConfigService, emailTemplateService: EmailTemplateService);
    sendApplicationNotification(clientEmail: string, clientName: string, jobTitle: string, applicationData: {
        candidateName: string;
        candidateEmail: string;
        phone?: string;
        coverLetter?: string;
        currentJobTitle?: string;
        yearsOfExperience?: number;
        skills?: string;
    }): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }>;
    sendApplicationStatusUpdate(candidateEmail: string, candidateName: string, jobTitle: string, companyName: string, newStatus: string, interviewDate?: Date, rejectionReason?: string): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }>;
    sendWelcomeEmail(agencyEmail: string, agencyName: string): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }>;
    sendJobPublishedNotification(clientEmail: string, clientName: string, jobTitle: string, jobSlug: string): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }>;
    private sendEmail;
    sendBulkEmails(recipients: string[], subject: string, html: string): Promise<{
        success: number;
        failed: number;
        errors: string[];
    }>;
}
