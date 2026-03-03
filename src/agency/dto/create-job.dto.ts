import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum, MaxLength, Min, Max } from 'class-validator';

export enum JobType {
  FULL_TIME = 'full-time',
  PART_TIME = 'part-time',
  CONTRACT = 'contract',
  FREELANCE = 'freelance',
  INTERNSHIP = 'internship'
}

export enum JobStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  CLOSED = 'closed',
  ARCHIVED = 'archived'
}

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description: string;

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
  @IsString()
  @MaxLength(1000)
  requirements?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  department?: string;
}