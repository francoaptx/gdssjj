// src/auth/dto/register.dto.ts
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class RegisterDto {
  @IsString()
  name: string;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsNumber() // Assuming office ID is a number
  officeId: number;

  @IsNumber() // Assuming role ID is a number
  roleId: number;

  @IsOptional()
  @IsString()
  contract?: string;
}