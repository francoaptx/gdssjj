// src/folders/folders.controller.ts
import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { FoldersService } from './folders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User as CurrentUser } from '../common/decorators/user.decorator';

@Controller('folders')
@UseGuards(JwtAuthGuard)
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Post()
  create(@Body('name') name: string, @CurrentUser() user: any) {
    return this.foldersService.create(user.userId, name);
  }

  @Get()
  findAll() {
    return this.foldersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foldersService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.foldersService.remove(+id);
  }
}