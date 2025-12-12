import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OfficesModule } from './offices/offices.module';
import { RolesModule } from './roles/roles.module';
import { CopiesModule } from './copies/copies.module';
import { DocumentsModule } from './documents/documents.module';
import { FoldersModule } from './folders/folders.module';
import { GroupsModule } from './groups/groups.module';
import { HistoryModule } from './history/history.module';
import { RoutingSheetsModule } from './routing-sheets/routing-sheets.module';
import { ReportsModule } from './reports/reports.module';
import { PositionsModule } from './positions/positions.module';
import { SeedService } from './seeds/seed.service';
import { SeedModule } from './seeds/seed.module';
import { Role } from './roles/entities/role.entity';
import { Office } from './offices/entities/office.entity';
import { Position } from './positions/entities/position.entity';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USER || 'franco',
      password: process.env.DB_PASSWORD || 'defcon11',
      database: process.env.DB_NAME || 'corsj',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
    }),
    TypeOrmModule.forFeature([Role, Office, Position, User]),
    AuthModule,
    UsersModule,
    OfficesModule,
    RolesModule,
    CopiesModule,
    DocumentsModule,
    FoldersModule,
    GroupsModule,
    HistoryModule,
    RoutingSheetsModule,
    ReportsModule,
    PositionsModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeedService],
})
export class AppModule {}