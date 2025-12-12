// src/copies/copies.controller.ts
import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { CopiesService } from './copies.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('copies')
@UseGuards(JwtAuthGuard)
export class CopiesController {
  constructor(private readonly copiesService: CopiesService) {}

  @Post()
  create(@Body('routingSheetId') routingSheetId: number, @Body('recipientId') recipientId: number, @Body('provision') provision: string) {
    return this.copiesService.create(routingSheetId, recipientId, provision);
  }

  @Get('routing-sheet/:routingSheetId')
  findAllForRoutingSheet(@Param('routingSheetId') routingSheetId: string) {
    return this.copiesService.findAllForRoutingSheet(+routingSheetId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.copiesService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.copiesService.remove(+id);
  }
}