// src/offices/offices.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsRelationByString } from 'typeorm';
import { Office } from './entities/office.entity';

@Injectable()
export class OfficesService {
  constructor(
    @InjectRepository(Office)
    private officesRepository: Repository<Office>,
  ) {}

  async create(name: string): Promise<Office> {
    const existingOffice = await this.officesRepository.findOne({ where: { name } });
    if (existingOffice) {
      throw new BadRequestException('Office with this name already exists');
    }
    const office = this.officesRepository.create({ name });
    return this.officesRepository.save(office);
  }

  async findAll(): Promise<Office[]> {
    // Evitar cargar las relaciones para prevenir problemas de serialización
    return this.officesRepository.find();
  }

  async findOne(id: number): Promise<Office> {
    // Evitar cargar las relaciones para prevenir problemas de serialización
    const office = await this.officesRepository.findOne({ where: { id } });
    if (!office) {
      throw new NotFoundException(`Office with ID ${id} not found`);
    }
    return office;
  }

  async update(id: number, name: string): Promise<Office> {
    const office = await this.findOne(id);
    const existingOffice = await this.officesRepository.findOne({ where: { name } });
    if (existingOffice && existingOffice.id !== id) {
      throw new BadRequestException('Office with this name already exists');
    }
    office.name = name;
    return this.officesRepository.save(office);
  }

  async remove(id: number): Promise<void> {
    const office = await this.findOne(id); // Throws NotFoundException if not found
    await this.officesRepository.remove(office);
  }
}