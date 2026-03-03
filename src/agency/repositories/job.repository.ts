import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { Job } from '../entities/job.entity';
import { BaseRepository } from '../../common/repositories/base.repository';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Injectable()
export class JobRepository extends BaseRepository<Job> {
  constructor(
    @InjectRepository(Job)
    repository: Repository<Job>,
  ) {
    super(repository, 'job');
  }

  protected getTenantField(): string {
    return 'client.agencyId';
  }

  // Tenant-scoped find with role-based filtering
  async findJobsByUser(user: CurrentUser, options?: FindManyOptions<Job>): Promise<Job[]> {
    const queryBuilder = this.createTenantQueryBuilder(user)
      .leftJoinAndSelect('job.client', 'client')
      .leftJoinAndSelect('job.applications', 'applications');

    // Apply additional filtering based on user role
    if (user.role === 'client' && user.clientId) {
      // Client users can only see jobs for their specific client
      queryBuilder.andWhere('job.clientId = :clientId', { clientId: user.clientId });
    }
    // Agency users already filtered by agencyId in base query

    if (options?.where) {
      queryBuilder.andWhere(options.where);
    }

    if (options?.order) {
      Object.entries(options.order).forEach(([field, direction]) => {
        queryBuilder.addOrderBy(`job.${field}`, direction as 'ASC' | 'DESC');
      });
    }

    if (options?.take) {
      queryBuilder.take(options.take);
    }

    if (options?.skip) {
      queryBuilder.skip(options.skip);
    }

    return queryBuilder.getMany();
  }

  // Find single job with tenant isolation
  async findJobById(user: CurrentUser, jobId: number): Promise<Job | null> {
    const queryBuilder = this.createTenantQueryBuilder(user)
      .leftJoinAndSelect('job.client', 'client')
      .leftJoinAndSelect('job.applications', 'applications')
      .where('job.id = :jobId', { jobId });

    // Additional client filtering
    if (user.role === 'client' && user.clientId) {
      queryBuilder.andWhere('job.clientId = :clientId', { clientId: user.clientId });
    }

    return queryBuilder.getOne();
  }

  // Count jobs with tenant isolation
  async countJobsByUser(user: CurrentUser, options?: FindManyOptions<Job>): Promise<number> {
    const queryBuilder = this.createTenantQueryBuilder(user);

    if (user.role === 'client' && user.clientId) {
      queryBuilder.andWhere('job.clientId = :clientId', { clientId: user.clientId });
    }

    if (options?.where) {
      queryBuilder.andWhere(options.where);
    }

    return queryBuilder.getCount();
  }

  // Find jobs by status with tenant isolation
  async findJobsByStatus(user: CurrentUser, status: string): Promise<Job[]> {
    const queryBuilder = this.createTenantQueryBuilder(user)
      .leftJoinAndSelect('job.client', 'client')
      .where('job.status = :status', { status });

    if (user.role === 'client' && user.clientId) {
      queryBuilder.andWhere('job.clientId = :clientId', { clientId: user.clientId });
    }

    return queryBuilder.getMany();
  }

  // Find jobs by client with tenant isolation
  async findJobsByClient(user: CurrentUser, clientId: number): Promise<Job[]> {
    const queryBuilder = this.createTenantQueryBuilder(user)
      .leftJoinAndSelect('job.client', 'client')
      .leftJoinAndSelect('job.applications', 'applications')
      .where('job.clientId = :clientId', { clientId });

    // Client users can only see their own jobs
    if (user.role === 'client' && user.clientId !== clientId) {
      throw new Error('Access denied: Cannot view jobs for other clients');
    }

    return queryBuilder.getMany();
  }

  // Create job with tenant context
  async createJob(user: CurrentUser, jobData: Partial<Job>): Promise<Job> {
    const job = this.repository.create(jobData);
    
    // Ensure job is created within tenant context
    if (user.role === 'agency') {
      // Agency users can create jobs for any client in their agency
      // The clientId should be provided in jobData
      if (!jobData.clientId) {
        throw new Error('ClientId is required when creating a job');
      }
    } else if (user.role === 'client') {
      // Client users can only create jobs for themselves
      job.clientId = user.clientId;
    }

    return this.repository.save(job);
  }

  // Update job with tenant validation
  async updateJob(user: CurrentUser, jobId: number, updateData: Partial<Job>): Promise<Job> {
    const job = await this.findJobById(user, jobId);
    
    if (!job) {
      throw new Error('Job not found or access denied');
    }

    // Additional validation for client users
    if (user.role === 'client' && job.clientId !== user.clientId) {
      throw new Error('Access denied: Cannot update job for other client');
    }

    Object.assign(job, updateData);
    return this.repository.save(job);
  }

  // Delete job with tenant validation
  async deleteJob(user: CurrentUser, jobId: number): Promise<void> {
    const job = await this.findJobById(user, jobId);
    
    if (!job) {
      throw new Error('Job not found or access denied');
    }

    // Additional validation for client users
    if (user.role === 'client' && job.clientId !== user.clientId) {
      throw new Error('Access denied: Cannot delete job for other client');
    }

    await this.repository.softRemove(job);
  }
}
