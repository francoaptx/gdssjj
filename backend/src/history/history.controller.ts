// src/history/history.controller.ts
import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import { HistoryService } from './history.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User as CurrentUser } from '../common/decorators/user.decorator';

@Controller('history')
@UseGuards(JwtAuthGuard)
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  // Endpoint genérico para consultar historial por hoja de ruta
  @Get('routing-sheet/:routingSheetId')
  findByRoutingSheet(@Param('routingSheetId') routingSheetId: string) {
    return this.historyService.findByRoutingSheet(+routingSheetId);
  }

  // Endpoint para consultar historial de acciones del usuario logueado
  @Get('user')
  findAll(@CurrentUser() user: any) {
    return this.historyService.findAll();
  }

  // No exponemos un endpoint POST general aquí, la creación de historial debería ser interna del sistema.
  // Se puede hacer un servicio interno o un endpoint privado si es necesario para fines de auditoría manual.
}