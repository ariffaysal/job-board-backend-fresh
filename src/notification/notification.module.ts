import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationService } from './notification.service';
import { EmailTemplateService } from './email-template.service';

@Module({
  imports: [ConfigModule],
  providers: [NotificationService, EmailTemplateService, ConfigService],
  exports: [NotificationService, EmailTemplateService],
})
export class NotificationModule {}
