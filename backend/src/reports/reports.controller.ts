import { Controller, Get, Param, Res, UseGuards, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReportsService } from './reports.service';

@Controller('reports')
@UseGuards(JwtAuthGuard) // Proteger los endpoints de reportes
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('routing-sheet/:id/html')
  async getRoutingSheetReport(@Param('id') id: string) {
    return this.reportsService.generateRoutingSheetReport(+id);
  }

  @Get('performance/html')
  async getPerformanceReport() {
    return this.reportsService.generateOfficePerformanceReport();
  }

  @Get('statistics')
  async getStatisticsReport() {
    return this.reportsService.generateStatisticsReport();
  }
}