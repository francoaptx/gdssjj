// src/cites/cites.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm'; // Importar Like
import { Cite } from './entities/cite.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class CitesService {
  constructor(
    @InjectRepository(Cite)
    private citesRepository: Repository<Cite>,
    private usersService: UsersService, // Inyectar UsersService
  ) {}

  async create(userId: number, citeData: Omit<Cite, 'id' | 'number' | 'isUploaded' | 'createdAt' | 'uploadedAt' | 'createdBy'>): Promise<Cite> {
    const user = await this.usersService.findOne(userId); // Valida que el usuario exista

    // Generar número de cite: OFICINA-CORRELATIVO-ANO
    const year = new Date().getFullYear();
    const officeCode = user.office.name.substring(0, 3).toUpperCase(); // Asumiendo código de 3 letras
    const lastCitesOfYear = await this.citesRepository.find({
      where: {
        number: Like(`${officeCode}-%-${year}`), // Busca cites del mismo año y oficina
      },
      order: { number: 'DESC' }, // Ordena descendente para obtener el último
    });

    let correlativo = 1;
    if (lastCitesOfYear.length > 0) {
        // Extrae el correlativo del número existente y suma 1
        const lastCiteNumber = lastCitesOfYear[0].number;
        const parts = lastCiteNumber.split('-');
        correlativo = parseInt(parts[1], 10) + 1;
    }
    const citeNumber = `${officeCode}-${correlativo.toString().padStart(3, '0')}-${year}`;

    const existingCite = await this.citesRepository.findOne({ where: { number: citeNumber } });
    if (existingCite) {
      // En teoría, esto no debería pasar si la lógica de generación es correcta
      throw new BadRequestException('Generated cite number already exists.');
    }

    const cite = this.citesRepository.create({
      ...citeData,
      number: citeNumber,
      createdBy: user,
    });
    return this.citesRepository.save(cite);
  }

  async findAll(): Promise<Cite[]> {
    return this.citesRepository.find({ relations: ['createdBy', 'createdBy.office'] });
  }

  async findOne(id: number): Promise<Cite> {
    const cite = await this.citesRepository.findOne({ where: { id }, relations: ['createdBy', 'createdBy.office', 'documents', 'routingSheets'] });
    if (!cite) {
      throw new NotFoundException(`Cite with ID ${id} not found`);
    }
    return cite;
  }

  async markAsUploaded(id: number): Promise<Cite> {
    const cite = await this.findOne(id); // Throws NotFoundException if not found
    if (cite.isUploaded) {
      throw new BadRequestException('Cite is already marked as uploaded.');
    }
    cite.isUploaded = true;
    cite.uploadedAt = new Date();
    return this.citesRepository.save(cite);
  }

  async remove(id: number): Promise<void> {
    const cite = await this.findOne(id); // Throws NotFoundException if not found
    await this.citesRepository.remove(cite);
  }
}