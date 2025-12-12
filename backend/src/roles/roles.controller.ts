// src/roles/roles.controller.ts
import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('roles')
@UseGuards(JwtAuthGuard) // Proteger el acceso
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body('name') name: string) {
    return this.rolesService.create(name);
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}