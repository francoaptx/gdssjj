import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RoutingSheetsModule } from './routing-sheets/routing-sheets.module';
import { HistoryModule } from './history/history.module';
import { CitesModule } from './cites/cites.module';
import { FoldersModule } from './folders/folders.module';
import { CopiesModule } from './copies/copies.module';
import { OfficesModule } from './offices/offices.module';
import { PositionsModule } from './positions/positions.module';
import { RolesModule } from './roles/roles.module';
import { SeedModule } from './seeds/seed.module';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';
import { DocumentsModule } from './documents/documents.module';
import { GroupsModule } from './groups/groups.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME || 'franco',
      password: process.env.DB_PASSWORD || 'defcon11',
      database: process.env.DB_NAME || 'corsj',
      autoLoadEntities: true,
      synchronize: true, // Only for development
    }),
    UsersModule,
    RoutingSheetsModule,
    HistoryModule,
    CitesModule,
    FoldersModule,
    CopiesModule,
    OfficesModule,
    PositionsModule,
    RolesModule,
    SeedModule,
    AuthModule,
    DocumentsModule,
    GroupsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}