import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateAgencyDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}