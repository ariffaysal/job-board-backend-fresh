import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgencyController } from './agency.controller';
import { AgencyService } from './agency.service';
import { Agency } from './entities/agency.entity';
import { Client } from './entities/client.entity';
import { Job } from './entities/job.entity';
import { Application } from './entities/application.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Agency, Client, Job, Application]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AgencyController],
  providers: [AgencyService, JwtAuthGuard],
  exports: [AgencyService],
})
export class AgencyModule {}
