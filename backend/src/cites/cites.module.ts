import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cite } from './entities/cite.entity';
import { CitesService } from './cites.service';
import { CitesController } from './cites.controller';
import { UsersModule } from '../users/users.module'; // Para obtener el usuario que crea el cite

@Module({
  imports: [TypeOrmModule.forFeature([Cite]), UsersModule],
  providers: [CitesService],
  controllers: [CitesController],
  exports: [CitesService, TypeOrmModule], // Exportar TypeOrmModule para que el repositorio esté disponible
})
export class CitesModule {}