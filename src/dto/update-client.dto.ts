import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateClientDto {
  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  contactPerson?: string;
}
