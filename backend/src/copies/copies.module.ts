// src/copies/copies.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Copy } from './entities/copy.entity';
import { CopiesService } from './copies.service';
import { CopiesController } from './copies.controller';
import { forwardRef } from '@nestjs/common';
import { RoutingSheetsModule } from '../routing-sheets/routing-sheets.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Copy]), 
    forwardRef(() => RoutingSheetsModule), 
    UsersModule],
  providers: [CopiesService],
  controllers: [CopiesController],
  exports: [CopiesService],
})
export class CopiesModule {}