// src/offices/offices.controller.ts
import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, BadRequestException } from '@nestjs/common';
import { OfficesService } from './offices.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Office } from './entities/office.entity';

@Controller('offices')
@UseGuards(JwtAuthGuard) // Proteger el acceso
export class OfficesController {
  constructor(private readonly officesService: OfficesService) {}

  @Post()
  async create(@Body('name') name: string): Promise<Office> {
    if (!name || name.trim().length === 0) {
      throw new BadRequestException('Office name is required');
    }
    return await this.officesService.create(name.trim());
  }

  @Get()
  async findAll(): Promise<Office[]> {
    return await this.officesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Office> {
    return await this.officesService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body('name') name: string): Promise<Office> {
    if (!name || name.trim().length === 0) {
      throw new BadRequestException('Office name is required');
    }
    return await this.officesService.update(+id, name.trim());
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.officesService.remove(+id);
  }
}