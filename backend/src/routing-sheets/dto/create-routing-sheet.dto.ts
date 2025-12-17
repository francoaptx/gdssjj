// src/routing-sheets/dto/create-routing-sheet.dto.ts
import { IsString, IsOptional, IsInt, Min, IsBoolean, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CopyDto {
  @IsInt() recipientId: number;
  @IsString() provision: string;
}

export class CreateRoutingSheetDto {
  @IsString()
  @IsOptional()
  reference?: string;

  @IsInt()
  recipientId: number;

  @IsString()
  @IsOptional()
  provision?: string;

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

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CopyDto)
  copies?: CopyDto[];
}