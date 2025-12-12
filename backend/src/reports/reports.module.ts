import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { RoutingSheet } from '../routing-sheets/entities/routing-sheet.entity';
import { User } from '../users/entities/user.entity';
import { Office } from '../offices/entities/office.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoutingSheet, User, Office])],
  providers: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}