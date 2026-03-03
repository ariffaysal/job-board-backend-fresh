import { IsEmail, IsNotEmpty, IsOptional, IsString, IsEnum, MaxLength, IsPhoneNumber, IsNumber, Min, Max } from 'class-validator';

export enum ApplicationStatus {
  APPLIED = 'applied',
  SHORTLISTED = 'shortlisted',
  REJECTED = 'rejected',
  HIRED = 'hired'
}

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  candidateName: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  candidateEmail: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  coverLetter?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  currentJobTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  currentCompany?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  linkedInProfile?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  portfolioUrl?: string;

  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(50)
  yearsOfExperience?: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  expectedSalary?: string;
}