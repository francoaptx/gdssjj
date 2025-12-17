// src/routing-sheets/dto/update-routing-sheet.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateRoutingSheetDto } from './create-routing-sheet.dto';
import { IsString, IsOptional, IsInt, Min, IsDateString } from 'class-validator';

export class UpdateRoutingSheetDto extends PartialType(CreateRoutingSheetDto) {
  @IsString()
  @IsOptional()
  provision?: string;

  @IsInt()
  @IsOptional()
  numberOfPages?: number;

  @IsInt()
  @IsOptional()
  numberOfAttachments?: number;

  @IsDateString()
  @IsOptional()
  processedAt?: string;

  @IsInt()
  @IsOptional()
  recipientId?: number;
}