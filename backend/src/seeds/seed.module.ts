// src/seeds/seed.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SeedService } from './seed.service';
import { Role } from '../roles/entities/role.entity';
import { Office } from '../offices/entities/office.entity';
import { User } from '../users/entities/user.entity';
import { PositionsModule } from '../positions/positions.module';
import { Position } from '../positions/entities/position.entity';

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
    TypeOrmModule.forFeature([Role, Office, User, Position]),
    PositionsModule,
  ],
  providers: [SeedService],
})
export class SeedModule {}