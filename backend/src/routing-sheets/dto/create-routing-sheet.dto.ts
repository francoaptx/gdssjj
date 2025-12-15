// src/routing-sheets/dto/create-routing-sheet.dto.ts
import { IsString, IsOptional, IsInt, Min, IsBoolean, IsDateString } from 'class-validator';

export class CreateRoutingSheetDto {
  @IsString()
  reference: string;

  @IsInt()
  recipientId: number;

  @IsString()
  provision: string;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  attachments?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  numberOfPages?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  numberOfAttachments?: number;

  @IsBoolean()
  hasCite: boolean;

  @IsInt()
  @IsOptional()
  citeId?: number;

  @IsString()
  priority: string;
}