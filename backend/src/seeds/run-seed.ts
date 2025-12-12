// src/seeds/run-seed.ts
import { config } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { SeedService } from './seed.service';

// Load environment variables
config();

async function runSeed() {
  try {
    const appContext = await NestFactory.createApplicationContext(SeedModule);
    const seeder = appContext.get(SeedService);
    await seeder.run();
    await appContext.close();
    console.log('Seeding completado exitosamente');
  } catch (error) {
    console.error('Error durante el proceso de seeding:', error);
    process.exit(1);
  }
}

// Solo ejecutar si este archivo es el módulo principal
if (require.main === module) {
    runSeed();
}