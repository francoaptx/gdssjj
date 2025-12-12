// src/routing-sheets/routing-sheets.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutingSheet } from './entities/routing-sheet.entity';
import { RoutingSheetsService } from './routing-sheets.service';
import { RoutingSheetsController } from './routing-sheets.controller';
import { UsersModule } from '../users/users.module';
import { CitesModule } from '../cites/cites.module';
import { CopiesModule } from '../copies/copies.module';
import { GroupsModule } from '../groups/groups.module';
import { HistoryModule } from '../history/history.module';
import { FoldersModule } from '../folders/folders.module';
import { Cite } from '../cites/entities/cite.entity';
import { User } from '../users/entities/user.entity';
import { Folder } from '../folders/entities/folder.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoutingSheet, User, Cite, Folder]),
    UsersModule,
    CitesModule,
    forwardRef(() => CopiesModule),
    forwardRef(() => GroupsModule),
    forwardRef(() => HistoryModule),
    FoldersModule,
  ],
  providers: [RoutingSheetsService],
  controllers: [RoutingSheetsController],
  exports: [RoutingSheetsService],
})
export class RoutingSheetsModule {}