// src/groups/groups.controller.ts
import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  create(@Body('mainRoutingSheetId') mainRoutingSheetId: number, @Body('groupedRoutingSheetIds') groupedRoutingSheetIds: number[]) {
    // Tomar solo el primer ID de la lista para simplificar
    return this.groupsService.create(mainRoutingSheetId, groupedRoutingSheetIds[0]);
  }

  @Get('main/:mainRoutingSheetId')
  findAll(@Param('mainRoutingSheetId') mainRoutingSheetId: string) {
    return this.groupsService.findAll();
  }

  @Get('sheet/:routingSheetId/main')
  findOne(@Param('routingSheetId') routingSheetId: string) {
    return this.groupsService.findOne(+routingSheetId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupsService.remove(+id);
  }
}