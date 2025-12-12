// src/history/history.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { History } from './entities/history.entity';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { RoutingSheetsModule } from '../routing-sheets/routing-sheets.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([History]), forwardRef(() => RoutingSheetsModule), UsersModule],
  providers: [HistoryService],
  controllers: [HistoryController],
  exports: [HistoryService],
})
export class HistoryModule {}