import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SeedService } from './seeds/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enable CORS for frontend connections
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  
  // Iniciar la aplicación primero
  await app.listen(process.env.PORT || 3000);
  
  // Ejecutar seeds después de que la aplicación se haya iniciado
  const seeder = app.get(SeedService);
  try {
    await seeder.run();
    console.log('Seeding completado exitosamente');
  } catch (error) {
    console.error('Error durante el proceso de seeding:', error);
  }
}
bootstrap();