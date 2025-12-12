import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    return {
      type: 'postgres',
      host: configService.get('DB_HOST') || 'localhost',
      port: parseInt(configService.get('DB_PORT'), 10) || 5432,
      username: configService.get('DB_USER') || 'franco',
      password: configService.get('DB_PASSWORD') || 'defcon11',
      database: configService.get('DB_NAME') || 'corsj',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production', // Only for development
      logging: process.env.NODE_ENV === 'development', // Enable logging in development
    };
  },
};