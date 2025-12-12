// src/groups/groups.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { RoutingSheetsModule } from '../routing-sheets/routing-sheets.module';
import { RoutingSheet } from '../routing-sheets/entities/routing-sheet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Group, RoutingSheet]), forwardRef(() => RoutingSheetsModule)],
  providers: [GroupsService],
  controllers: [GroupsController],
  exports: [GroupsService],
})
export class GroupsModule {}