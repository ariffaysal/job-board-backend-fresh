import { IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class CreateClientDto {
  @IsNotEmpty()
  companyName: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  contactPerson?: string;

  @IsOptional()
  phone?: string;
}