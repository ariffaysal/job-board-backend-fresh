import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  candidateName: string;

  @IsEmail()
  @IsNotEmpty()
  candidateEmail: string;

  @IsOptional()
  @IsString()
  coverLetter?: string;
}