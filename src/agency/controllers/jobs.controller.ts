import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JobsService } from '../services/jobs.service';
import { CreateJobDto } from '../dto/create-job.dto';
import { UpdateJobDto } from '../dto/update-job.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JobStatus, JobType, JobExperienceLevel } from '../entities/job.entity';

@Controller('jobs')
@UseGuards(JwtAuthGuard)
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  async create(@CurrentUser() user: CurrentUser, @Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(user, createJobDto);
  }

  @Get()
  async findAll(
    @CurrentUser() user: CurrentUser,
    @Query('status') status?: JobStatus,
    @Query('type') type?: JobType,
    @Query('experienceLevel') experienceLevel?: JobExperienceLevel,
    @Query('clientId') clientId?: number,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.jobsService.findAll(user, {
      status,
      type,
      experienceLevel,
      clientId: clientId ? Number(clientId) : undefined,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    });
  }

  @Get('search')
  async search(
    @CurrentUser() user: CurrentUser,
    @Query('q') query: string,
    @Query('status') status?: JobStatus,
    @Query('type') type?: JobType,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    if (!query) {
      return { jobs: [], total: 0 };
    }

    return this.jobsService.search(user, query, {
      status,
      type,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    });
  }

  @Get('statistics')
  async getStatistics(@CurrentUser() user: CurrentUser) {
    return this.jobsService.getStatistics(user);
  }

  @Get('status/:status')
  async findByStatus(
    @CurrentUser() user: CurrentUser,
    @Param('status') status: JobStatus,
  ) {
    return this.jobsService.findByStatus(user, status);
  }

  @Get('client/:clientId')
  async findByClient(
    @CurrentUser() user: CurrentUser,
    @Param('clientId', ParseIntPipe) clientId: number,
  ) {
    return this.jobsService.findByClient(user, clientId);
  }

  @Get(':id')
  async findOne(@CurrentUser() user: CurrentUser, @Param('id', ParseIntPipe) id: number) {
    return this.jobsService.findOne(user, id);
  }

  @Patch(':id')
  async update(
    @CurrentUser() user: CurrentUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateJobDto: UpdateJobDto,
  ) {
    return this.jobsService.update(user, id, updateJobDto);
  }

  @Patch(':id/publish')
  @HttpCode(HttpStatus.OK)
  async publish(@CurrentUser() user: CurrentUser, @Param('id', ParseIntPipe) id: number) {
    return this.jobsService.publish(user, id);
  }

  @Patch(':id/close')
  @HttpCode(HttpStatus.OK)
  async close(@CurrentUser() user: CurrentUser, @Param('id', ParseIntPipe) id: number) {
    return this.jobsService.close(user, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@CurrentUser() user: CurrentUser, @Param('id', ParseIntPipe) id: number) {
    await this.jobsService.remove(user, id);
  }
}
