import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const randomName = uuidv4();
      return callback(null, `${randomName}${extname(file.originalname)}`);
    },
  }),
  fileFilter: (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf|doc|docx|xls|xlsx|ppt|pptx|txt|mp3|wav|ogg|mp4|avi|mov|mkv)$/i)) {
      return callback(new Error('Invalid file type'), false);
    }
    callback(null, true);
  },
};
// src/routing-sheets/routing-sheets.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutingSheet } from './entities/routing-sheet.entity';
import { RoutingSheetsController } from './routing-sheets.controller';
import { RoutingSheetsService } from './routing-sheets.service';
import { HistoryModule } from '../history/history.module';
import { UsersModule } from '../users/users.module';
import { CitesModule } from '../cites/cites.module';
import { FoldersModule } from '../folders/folders.module';
import { CopiesModule } from '../copies/copies.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoutingSheet]),
    HistoryModule,
    UsersModule,
    CitesModule,
    FoldersModule,
    CopiesModule,
    ConfigModule,
  ],
  controllers: [RoutingSheetsController],
  providers: [RoutingSheetsService],
  exports: [RoutingSheetsService],
})
export class RoutingSheetsModule {}