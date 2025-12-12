// src/offices/offices.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
      throw new Error('Office with this name already exists'); // Usar un error más específico si es necesario
    }
    const office = this.officesRepository.create({ name });
    return this.officesRepository.save(office);
  }

  findAll(): Promise<Office[]> {
    return this.officesRepository.find();
  }

  async findOne(id: number): Promise<Office> {
    const office = await this.officesRepository.findOne({ where: { id } });
    if (!office) {
      throw new NotFoundException(`Office with ID ${id} not found`);
    }
    return office;
  }

  async remove(id: number): Promise<void> {
    const office = await this.findOne(id); // Throws NotFoundException if not found
    await this.officesRepository.remove(office);
  }
}