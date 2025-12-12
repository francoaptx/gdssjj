import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNumber()
  officeId: number;

  @IsNumber()
  roleId: number;

  @IsNumber()
  positionId: number;

  @IsString()
  @IsOptional()
  contract?: string;
}