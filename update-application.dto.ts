import { IsOptional, IsString, IsIn } from 'class-validator';

export class UpdateApplicationDto {
  @IsOptional()
  @IsString()
  coverLetter?: string;

  @IsOptional()
  @IsIn(['applied', 'shortlisted', 'rejected', 'hired'])
  status?: 'applied' | 'shortlisted' | 'rejected' | 'hired';
}
