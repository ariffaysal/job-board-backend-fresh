import { IsString, IsOptional, IsUrl, IsEmail, Length } from 'class-validator';

export class UpdateAgencyDto {
  @IsOptional()
  @IsString()
  @Length(2, 100)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(5, 500)
  description?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  @Length(10, 20)
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  password?: string;
}