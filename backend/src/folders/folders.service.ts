// src/folders/folders.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Folder } from './entities/folder.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class FoldersService {
  constructor(
    @InjectRepository(Folder)
    private foldersRepository: Repository<Folder>,
    private usersService: UsersService,
  ) {}

  async create(userId: number, name: string): Promise<Folder> {
    const user = await this.usersService.findOne(userId); // Valida que el usuario exista

    // Verificar si ya existe una carpeta con el mismo nombre para este usuario/oficina
    // Asumiendo que las carpetas son por usuario/oficina, sino sería global.
    // Esta lógica puede variar según la interpretación exacta de IV.2.3
    // Por ahora, solo verificamos unicidad simple.
    const existingFolder = await this.foldersRepository.findOne({ where: { name } });
    if (existingFolder) {
        // Si se interpreta como única por oficina, se podría hacer:
        // const existingFolder = await this.foldersRepository.findOne({ where: { name, createdBy: { office: user.office } } });
        // Y lanzar un error si ya existe.
        // Para unicidad global:
        throw new BadRequestException('A folder with this name already exists.');
    }

    const folder = this.foldersRepository.create({
      name,
      createdBy: user,
    });
    return this.foldersRepository.save(folder);
  }

  async findAll(): Promise<Folder[]> {
    return this.foldersRepository.find({ relations: ['createdBy', 'createdBy.office'] });
  }

  async findOne(id: number): Promise<Folder> {
    const folder = await this.foldersRepository.findOne({ where: { id }, relations: ['createdBy', 'createdBy.office', 'archivedRoutingSheets'] });
    if (!folder) {
      throw new NotFoundException(`Folder with ID ${id} not found`);
    }
    return folder;
  }

  async remove(id: number): Promise<void> {
    const folder = await this.findOne(id); // Throws NotFoundException if not found
    // Verificar que no tenga hojas archivadas asociadas antes de eliminar
    if (folder.archivedRoutingSheets && folder.archivedRoutingSheets.length > 0) {
        throw new BadRequestException('Cannot delete a folder that contains archived routing sheets.');
    }
    await this.foldersRepository.remove(folder);
  }
}