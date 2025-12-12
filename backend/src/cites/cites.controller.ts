// src/cites/cites.controller.ts
import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { CitesService } from './cites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User as CurrentUser } from '../common/decorators/user.decorator';
import { Cite } from './entities/cite.entity';

@Controller('cites')
@UseGuards(JwtAuthGuard)
export class CitesController {
  constructor(private readonly citesService: CitesService) {}

  @Post()
  create(@Body() citeData: Omit<Cite, 'id' | 'number' | 'isUploaded' | 'createdAt' | 'uploadedAt' | 'createdBy'>, @CurrentUser() user: any) {
    return this.citesService.create(user.userId, citeData);
  }

  @Get()
  findAll() {
    return this.citesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.citesService.findOne(+id);
  }

  @Put(':id/upload')
  markAsUploaded(@Param('id') id: string) {
    return this.citesService.markAsUploaded(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.citesService.remove(+id);
  }
}