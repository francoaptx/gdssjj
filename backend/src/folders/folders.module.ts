// src/folders/folders.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from './entities/folder.entity';
import { FoldersService } from './folders.service';
import { FoldersController } from './folders.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Folder]), UsersModule],
  providers: [FoldersService],
  controllers: [FoldersController],
  exports: [FoldersService, TypeOrmModule], // Exportar TypeOrmModule para que el repositorio esté disponible
})
export class FoldersModule {}