import { IsString, IsOptional, IsNumber, IsEnum, MaxLength, Min, Max, IsBoolean } from 'class-validator';
import { JobType, JobStatus, JobExperienceLevel } from '../entities/job.entity';

export class UpdateJobDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  location?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1000000)
  salary?: number;

  @IsOptional()
  @IsEnum(JobType)
  type?: JobType;

  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;

  @IsOptional()
  @IsEnum(JobExperienceLevel)
  experienceLevel?: JobExperienceLevel;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  requirements?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  department?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  benefits?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  workSchedule?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  skills?: string;

  @IsOptional()
  @IsBoolean()
  isRemote?: boolean;
}