// src/roles/roles.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async create(name: string): Promise<Role> {
    const existingRole = await this.rolesRepository.findOne({ where: { name } });
    if (existingRole) {
      throw new Error('Role with this name already exists'); // Use a more specific error if needed
    }
    const role = this.rolesRepository.create({ name });
    return this.rolesRepository.save(role);
  }

  findAll(): Promise<Role[]> {
    return this.rolesRepository.find();
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.rolesRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  async remove(id: number): Promise<void> {
    const role = await this.findOne(id); // Throws NotFoundException if not found
    await this.rolesRepository.remove(role);
  }
}