// src/routing-sheets/dto/create-routing-sheet.dto.ts
import { IsString, IsOptional, IsInt, Min, IsBoolean, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CopyDto {
  @IsInt() recipientId: number;
  @IsString() provision: string;
}

export class CreateRoutingSheetDto {
  readonly recipientId: number;
  readonly reference?: string;
  readonly provision?: string;
  readonly date?: string;
  readonly attachments?: string;
  readonly hasCite?: boolean;
  readonly citeId?: number;
  readonly numberOfPages: number;
  readonly numberOfAttachments: number;
  readonly priority?: 'NORMAL' | 'URGENT';
}