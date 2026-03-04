"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailTemplateService = void 0;
const common_1 = require("@nestjs/common");
let EmailTemplateService = class EmailTemplateService {
    generateApplicationNotificationTemplate(data) {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Application Received</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
        .content { padding: 30px 20px; }
        .candidate-info { background: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px; }
        .info-row { display: flex; margin-bottom: 10px; }
        .info-label { font-weight: 600; min-width: 120px; color: #555; }
        .info-value { flex: 1; }
        .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: 600; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
        .skills { background: #e9ecef; padding: 10px; border-radius: 4px; margin-top: 10px; }
        .cover-letter { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 4px; margin-top: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 New Application Received</h1>
            <p>Someone is interested in your job posting!</p>
        </div>
        
        <div class="content">
            <h2>Job Details</h2>
            <p><strong>Position:</strong> ${data.jobTitle}</p>
            <p><strong>Client:</strong> ${data.clientName}</p>
            
            <div class="candidate-info">
                <h3>👤 Candidate Information</h3>
                <div class="info-row">
                    <span class="info-label">Name:</span>
                    <span class="info-value">${data.candidateName}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Email:</span>
                    <span class="info-value">${data.candidateEmail}</span>
                </div>
                ${data.phone ? `
                <div class="info-row">
                    <span class="info-label">Phone:</span>
                    <span class="info-value">${data.phone}</span>
                </div>` : ''}
                ${data.currentJobTitle ? `
                <div class="info-row">
                    <span class="info-label">Current Role:</span>
                    <span class="info-value">${data.currentJobTitle}</span>
                </div>` : ''}
                ${data.yearsOfExperience ? `
                <div class="info-row">
                    <span class="info-label">Experience:</span>
                    <span class="info-value">${data.yearsOfExperience} years</span>
                </div>` : ''}
            </div>
            
            ${data.skills ? `
            <div class="skills">
                <h4>💼 Skills</h4>
                <p>${data.skills}</p>
            </div>` : ''}
            
            ${data.coverLetter ? `
            <div class="cover-letter">
                <h4>📝 Cover Letter</h4>
                <p>${data.coverLetter}</p>
            </div>` : ''}
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${data.dashboardUrl}" class="cta-button">View in Dashboard</a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
                This notification was sent to ${data.clientName}. You can view all applications in your dashboard.
            </p>
        </div>
        
        <div class="footer">
            <p>© 2024 Job Board Platform. All rights reserved.</p>
            <p>You're receiving this email because you're a client on our platform.</p>
        </div>
    </div>
</body>
</html>`;
    }
    generateStatusUpdateTemplate(data) {
        const statusColors = {
            'Pending': '#ffc107',
            'Interviewing': '#17a2b8',
            'Hired': '#28a745',
            'Rejected': '#dc3545'
        };
        const statusColor = statusColors[data.newStatus] || '#6c757d';
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Status Update</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
        .content { padding: 30px 20px; }
        .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; color: white; font-weight: 600; margin: 15px 0; }
        .job-info { background: #f8f9fa; padding: 20px; border-radius: 4px; margin: 20px 0; }
        .interview-info { background: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 4px; margin: 15px 0; }
        .rejection-info { background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 4px; margin: 15px 0; }
        .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: 600; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Application Status Update</h1>
            <p>Your application status has changed</p>
        </div>
        
        <div class="content">
            <h2>Hi ${data.candidateName},</h2>
            <p>Good news! There's an update on your application for <strong>${data.jobTitle}</strong> at <strong>${data.companyName}</strong>.</p>
            
            <div style="text-align: center; margin: 20px 0;">
                <div class="status-badge" style="background-color: ${statusColor};">
                    Status: ${data.newStatus}
                </div>
            </div>
            
            <div class="job-info">
                <h3>📋 Application Details</h3>
                <p><strong>Position:</strong> ${data.jobTitle}</p>
                <p><strong>Company:</strong> ${data.companyName}</p>
                <p><strong>Applied:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            ${data.interviewDate ? `
            <div class="interview-info">
                <h4>🗓️ Interview Scheduled</h4>
                <p><strong>Date:</strong> ${data.interviewDate.toLocaleDateString()}</p>
                <p><strong>Time:</strong> ${data.interviewDate.toLocaleTimeString()}</p>
                <p>Please make sure to attend the interview at the scheduled time. Good luck!</p>
            </div>` : ''}
            
            ${data.rejectionReason ? `
            <div class="rejection-info">
                <h4>📝 Feedback</h4>
                <p>${data.rejectionReason}</p>
                <p>Don't be discouraged! Keep applying for other opportunities that match your skills.</p>
            </div>` : ''}
            
            ${data.newStatus === 'Interviewing' ? `
            <p>🎉 Congratulations! The employer is interested in your profile and wants to schedule an interview. Check your dashboard for interview details.</p>
            ` : ''}
            
            ${data.newStatus === 'Hired' ? `
            <p>🎊 Congratulations! You've been hired! Welcome to the team. Check your dashboard for next steps.</p>
            ` : ''}
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${data.dashboardUrl}" class="cta-button">View Application</a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
                This is an automated notification. You can view all your applications in your dashboard.
            </p>
        </div>
        
        <div class="footer">
            <p>© 2024 Job Board Platform. All rights reserved.</p>
            <p>You're receiving this email because you applied for a job on our platform.</p>
        </div>
    </div>
</body>
</html>`;
    }
    generateWelcomeTemplate(data) {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Job Board Platform</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
        .content { padding: 30px 20px; }
        .feature-list { margin: 20px 0; }
        .feature-item { display: flex; align-items: center; margin-bottom: 15px; }
        .feature-icon { font-size: 24px; margin-right: 15px; }
        .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: 600; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Welcome to Job Board Platform!</h1>
            <p>We're excited to have you on board</p>
        </div>
        
        <div class="content">
            <h2>Hi ${data.agencyName},</h2>
            <p>Welcome to our Job Board Platform! Your account has been successfully created and you're ready to start posting jobs and managing applications.</p>
            
            <h3>✨ What You Can Do</h3>
            <div class="feature-list">
                <div class="feature-item">
                    <span class="feature-icon">📝</span>
                    <div>
                        <strong>Post Jobs</strong>
                        <p>Create and manage job postings for multiple clients</p>
                    </div>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">👥</span>
                    <div>
                        <strong>Manage Applications</strong>
                        <p>Review and respond to candidate applications</p>
                    </div>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">📊</span>
                    <div>
                        <strong>Track Analytics</strong>
                        <p>Monitor job performance and application metrics</p>
                    </div>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">🏢</span>
                    <div>
                        <strong>Client Management</strong>
                        <p>Organize and manage multiple client accounts</p>
                    </div>
                </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${data.dashboardUrl}" class="cta-button">Go to Dashboard</a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
                If you have any questions, feel free to reach out to our support team. We're here to help you succeed!
            </p>
        </div>
        
        <div class="footer">
            <p>© 2024 Job Board Platform. All rights reserved.</p>
            <p>You're receiving this email because you recently created an account on our platform.</p>
        </div>
    </div>
</body>
</html>`;
    }
    generateJobPublishedTemplate(data) {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Job Published Successfully</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
        .content { padding: 30px 20px; }
        .job-details { background: #f8f9fa; padding: 20px; border-radius: 4px; margin: 20px 0; }
        .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: 600; margin: 10px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✅ Job Published Successfully!</h1>
            <p>Your job is now live and visible to candidates</p>
        </div>
        
        <div class="content">
            <h2>Hi ${data.clientName},</h2>
            <p>Great news! Your job posting has been successfully published and is now visible to job seekers.</p>
            
            <div class="job-details">
                <h3>📋 Job Details</h3>
                <p><strong>Position:</strong> ${data.jobTitle}</p>
                <p><strong>Status:</strong> Published ✅</p>
                <p><strong>Published:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${data.jobUrl}" class="cta-button">View Job Posting</a>
                <br><br>
                <a href="${data.dashboardUrl}" class="cta-button">Manage Jobs</a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
                You can track applications and manage this job from your dashboard. Candidates will start applying soon!
            </p>
        </div>
        
        <div class="footer">
            <p>© 2024 Job Board Platform. All rights reserved.</p>
            <p>You're receiving this email because you're a client on our platform.</p>
        </div>
    </div>
</body>
</html>`;
    }
};
exports.EmailTemplateService = EmailTemplateService;
exports.EmailTemplateService = EmailTemplateService = __decorate([
    (0, common_1.Injectable)()
], EmailTemplateService);
//# sourceMappingURL=email-template.service.js.map