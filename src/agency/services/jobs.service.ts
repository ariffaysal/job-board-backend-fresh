import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Job } from '../entities/job.entity';
import { JobRepository } from '../repositories/job.repository';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateJobDto } from '../dto/create-job.dto';
import { UpdateJobDto } from '../dto/update-job.dto';
import { JobStatus, JobType, JobExperienceLevel } from '../entities/job.entity';

@Injectable()
export class JobsService {
  constructor(private readonly jobRepository: JobRepository) {}

  /**
   * Get all jobs accessible to the current user
   * - Agency users: See all jobs for their agency
   * - Client users: See only jobs for their specific client
   */
  async findAll(user: CurrentUser, filters?: {
    status?: JobStatus;
    type?: JobType;
    experienceLevel?: JobExperienceLevel;
    clientId?: number;
    limit?: number;
    offset?: number;
  }): Promise<{ jobs: Job[]; total: number }> {
    const options: any = {
      relations: ['client', 'applications'],
      order: { createdAt: 'DESC' },
    };

    // Apply filters
    const whereConditions: any = {};
    
    if (filters?.status) {
      whereConditions.status = filters.status;
    }
    
    if (filters?.type) {
      whereConditions.type = filters.type;
    }
    
    if (filters?.experienceLevel) {
      whereConditions.experienceLevel = filters.experienceLevel;
    }

    if (filters?.clientId) {
      // Additional validation for client users
      if (user.role === 'client' && filters.clientId !== user.clientId) {
        throw new ForbiddenException('Cannot view jobs for other clients');
      }
      whereConditions.clientId = filters.clientId;
    }

    if (Object.keys(whereConditions).length > 0) {
      options.where = whereConditions;
    }

    if (filters?.limit) {
      options.take = filters.limit;
    }

    if (filters?.offset) {
      options.skip = filters.offset;
    }

    const [jobs, total] = await Promise.all([
      this.jobRepository.findJobsByUser(user, options),
      this.jobRepository.countJobsByUser(options)
    ]);

    return { jobs, total };
  }

  /**
   * Find a specific job by ID with tenant isolation
   */
  async findOne(user: CurrentUser, id: number): Promise<Job> {
    const job = await this.jobRepository.findJobById(user, id);
    
    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }

    return job;
  }

  /**
   * Create a new job with tenant context
   */
  async create(user: CurrentUser, createJobDto: CreateJobDto): Promise<Job> {
    // Business logic validation
    if (user.role === 'client' && !user.clientId) {
      throw new ForbiddenException('Client users must have a clientId assigned');
    }

    // Set default values
    const jobData: Partial<Job> = {
      ...createJobDto,
      status: createJobDto.status || JobStatus.DRAFT,
      type: createJobDto.type || JobType.FULL_TIME,
    };

    // Client users can only create jobs for themselves
    if (user.role === 'client') {
      jobData.clientId = user.clientId;
    }

    return this.jobRepository.createJob(user, jobData);
  }

  /**
   * Update an existing job with tenant validation
   */
  async update(user: CurrentUser, id: number, updateJobDto: UpdateJobDto): Promise<Job> {
    // First check if job exists and user has access
    const existingJob = await this.findOne(user, id);

    // Business logic validation
    if (existingJob.status === JobStatus.PUBLISHED && updateJobDto.status === JobStatus.DRAFT) {
      throw new ForbiddenException('Cannot revert published job to draft status');
    }

    return this.jobRepository.updateJob(user, id, updateJobDto);
  }

  /**
   * Soft delete a job with tenant validation
   */
  async remove(user: CurrentUser, id: number): Promise<void> {
    const job = await this.findOne(user, id);

    // Business logic validation
    if (job.status === JobStatus.PUBLISHED) {
      throw new ForbiddenException('Cannot delete a published job. Please close it first.');
    }

    await this.jobRepository.deleteJob(user, id);
  }

  /**
   * Publish a job (change status from DRAFT to PUBLISHED)
   */
  async publish(user: CurrentUser, id: number): Promise<Job> {
    const job = await this.findOne(user, id);

    if (job.status !== JobStatus.DRAFT) {
      throw new ForbiddenException('Only draft jobs can be published');
    }

    return this.jobRepository.updateJob(user, id, { status: JobStatus.PUBLISHED });
  }

  /**
   * Close a job (change status to CLOSED)
   */
  async close(user: CurrentUser, id: number): Promise<Job> {
    const job = await this.findOne(user, id);

    if (job.status === JobStatus.CLOSED) {
      throw new ForbiddenException('Job is already closed');
    }

    return this.jobRepository.updateJob(user, id, { status: JobStatus.CLOSED });
  }

  /**
   * Get jobs by status for the current user
   */
  async findByStatus(user: CurrentUser, status: JobStatus): Promise<Job[]> {
    return this.jobRepository.findJobsByStatus(user, status);
  }

  /**
   * Get jobs for a specific client (with tenant isolation)
   */
  async findByClient(user: CurrentUser, clientId: number): Promise<Job[]> {
    // Client users can only view their own jobs
    if (user.role === 'client' && clientId !== user.clientId) {
      throw new ForbiddenException('Cannot view jobs for other clients');
    }

    return this.jobRepository.findJobsByClient(user, clientId);
  }

  /**
   * Get job statistics for the current user's tenant
   */
  async getStatistics(user: CurrentUser): Promise<{
    total: number;
    draft: number;
    published: number;
    closed: number;
    archived: number;
  }> {
    const [total, draft, published, closed, archived] = await Promise.all([
      this.jobRepository.countJobsByUser(user),
      this.jobRepository.countJobsByUser(user, { where: { status: JobStatus.DRAFT } }),
      this.jobRepository.countJobsByUser(user, { where: { status: JobStatus.PUBLISHED } }),
      this.jobRepository.countJobsByUser(user, { where: { status: JobStatus.CLOSED } }),
      this.jobRepository.countJobsByUser(user, { where: { status: JobStatus.ARCHIVED } }),
    ]);

    return { total, draft, published, closed, archived };
  }

  /**
   * Search jobs with tenant isolation
   */
  async search(user: CurrentUser, query: string, filters?: {
    status?: JobStatus;
    type?: JobType;
    limit?: number;
    offset?: number;
  }): Promise<{ jobs: Job[]; total: number }> {
    const options: any = {
      relations: ['client'],
      order: { createdAt: 'DESC' },
      where: [
        { title: `ILIKE :query` },
        { description: `ILIKE :query` },
        { requirements: `ILIKE :query` },
        { skills: `ILIKE :query` },
      ],
    };

    if (filters?.status) {
      options.where = options.where.map(condition => ({
        ...condition,
        status: filters.status,
      }));
    }

    if (filters?.type) {
      options.where = options.where.map(condition => ({
        ...condition,
        type: filters.type,
      }));
    }

    if (filters?.limit) {
      options.take = filters.limit;
    }

    if (filters?.offset) {
      options.skip = filters.offset;
    }

    const [jobs, total] = await Promise.all([
      this.jobRepository.findJobsByUser(user, options),
      this.jobRepository.countJobsByUser(options)
    ]);

    return { jobs, total };
  }
}
