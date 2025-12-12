// src/offices/offices.controller.ts
import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { OfficesService } from './offices.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('offices')
@UseGuards(JwtAuthGuard) // Proteger el acceso
export class OfficesController {
  constructor(private readonly officesService: OfficesService) {}

  @Post()
  create(@Body('name') name: string) {
    return this.officesService.create(name);
  }

  @Get()
  findAll() {
    return this.officesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.officesService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.officesService.remove(+id);
  }
}