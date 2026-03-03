import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailTemplateService } from './email-template.service';

// Mock Resend interface - in production, install and import from 'resend'
interface Resend {
  emails: {
    send: (options: {
      from: string;
      to: string | string[];
      subject: string;
      html?: string;
      text?: string;
    }) => Promise<{
        id: string;
        error?: any;
      }>;
  };
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private resend: Resend;

  constructor(
    private readonly configService: ConfigService,
    private readonly emailTemplateService: EmailTemplateService,
  ) {
    // Initialize Resend with API key from environment
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (apiKey) {
      // In production: this.resend = new Resend(apiKey);
      this.logger.log('Resend initialized with API key');
    } else {
      this.logger.warn('RESEND_API_KEY not found in environment variables');
    }
  }

  /**
   * Send application notification to client
   */
  async sendApplicationNotification(
    clientEmail: string,
    clientName: string,
    jobTitle: string,
    applicationData: {
      candidateName: string;
      candidateEmail: string;
      phone?: string;
      coverLetter?: string;
      currentJobTitle?: string;
      yearsOfExperience?: number;
      skills?: string;
    },
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
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
        dashboardUrl: `${this.configService.get<string>('FRONTEND_URL')}/dashboard`,
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
    } catch (error) {
      this.logger.error('Failed to send application notification', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Send application status update to candidate
   */
  async sendApplicationStatusUpdate(
    candidateEmail: string,
    candidateName: string,
    jobTitle: string,
    companyName: string,
    newStatus: string,
    interviewDate?: Date,
    rejectionReason?: string,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const subject = `Application Status Update: ${jobTitle} at ${companyName}`;
      
      const html = this.emailTemplateService.generateStatusUpdateTemplate({
        candidateName,
        jobTitle,
        companyName,
        newStatus,
        interviewDate,
        rejectionReason,
        dashboardUrl: `${this.configService.get<string>('FRONTEND_URL')}/applications`,
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
    } catch (error) {
      this.logger.error('Failed to send status update notification', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Send welcome email to new agency
   */
  async sendWelcomeEmail(
    agencyEmail: string,
    agencyName: string,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const subject = 'Welcome to Job Board Platform!';
      
      const html = this.emailTemplateService.generateWelcomeTemplate({
        agencyName,
        dashboardUrl: `${this.configService.get<string>('FRONTEND_URL')}/dashboard`,
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
    } catch (error) {
      this.logger.error('Failed to send welcome email', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Send job publication notification
   */
  async sendJobPublishedNotification(
    clientEmail: string,
    clientName: string,
    jobTitle: string,
    jobSlug: string,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const subject = `Job Published: ${jobTitle}`;
      
      const html = this.emailTemplateService.generateJobPublishedTemplate({
        clientName,
        jobTitle,
        jobUrl: `${this.configService.get<string>('FRONTEND_URL')}/jobs/${jobSlug}`,
        dashboardUrl: `${this.configService.get<string>('FRONTEND_URL')}/dashboard`,
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
    } catch (error) {
      this.logger.error('Failed to send job published notification', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Generic email sending method
   */
  private async sendEmail(options: {
    to: string | string[];
    subject: string;
    html?: string;
    text?: string;
  }): Promise<{ id: string }> {
    const fromEmail = this.configService.get<string>('FROM_EMAIL') || 'noreply@jobboard.com';

    if (!this.resend) {
      // Fallback to mock for development
      this.logger.log('Mock email send:', {
        to: options.to,
        subject: options.subject,
        htmlLength: options.html?.length || 0,
      });
      return { id: 'mock-id-' + Date.now() };
    }

    // Production email sending with Resend
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

  /**
   * Send bulk emails (for newsletters, etc.)
   */
  async sendBulkEmails(
    recipients: string[],
    subject: string,
    html: string,
  ): Promise<{ success: number; failed: number; errors: string[] }> {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Process in batches to avoid rate limits
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
        } catch (error) {
          results.failed++;
          results.errors.push(`${email}: ${error.message}`);
        }
      }

      // Add delay between batches to respect rate limits
      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }
}
