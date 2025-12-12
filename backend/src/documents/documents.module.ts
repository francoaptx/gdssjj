import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { CitesModule } from '../cites/cites.module';
import { UsersModule } from '../users/users.module';
import { RoutingSheetsModule } from '../routing-sheets/routing-sheets.module';
import { Cite } from '../cites/entities/cite.entity';
import { RoutingSheet } from '../routing-sheets/entities/routing-sheet.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document, Cite, RoutingSheet, User]), 
    CitesModule, 
    UsersModule,
    RoutingSheetsModule
  ],
  providers: [DocumentsService],
  controllers: [DocumentsController],
  exports: [DocumentsService],
})
export class DocumentsModule {}