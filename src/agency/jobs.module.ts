import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsController } from './controllers/jobs.controller';
import { JobsService } from './services/jobs.service';
import { JobRepository } from './repositories/job.repository';
import { Job } from './entities/job.entity';
import { Client } from './entities/client.entity';
import { Application } from './entities/application.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job, Client, Application]),
  ],
  controllers: [JobsController],
  providers: [JobsService, JobRepository],
  exports: [JobsService, JobRepository],
})
export class JobsModule {}
