// src/copies/copies.service.ts
import { Injectable, NotFoundException, BadRequestException, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Copy } from './entities/copy.entity';
import { RoutingSheet } from '../routing-sheets/entities/routing-sheet.entity';
import { RoutingSheetsService } from '../routing-sheets/routing-sheets.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class CopiesService {
  constructor(
    @InjectRepository(Copy)
    private copiesRepository: Repository<Copy>,
    @Inject(forwardRef(() => RoutingSheetsService))
    private routingSheetsService: RoutingSheetsService,
    private usersService: UsersService,
  ) {}

  async create(routingSheetId: number, recipientId: number, provision: string): Promise<Copy> {
    const routingSheet = await this.routingSheetsService.findOne(routingSheetId); // Valida la hoja
    const recipient = await this.usersService.findOne(recipientId); // Valida el destinatario

    // No se verifica si la hoja ya ha sido recibida, eso podría ser responsabilidad de la lógica de negocio al momento de enviar copias

    const copy = this.copiesRepository.create({
      routingSheet: routingSheet,
      recipient: recipient,
      provision: provision,
    });
    return this.copiesRepository.save(copy);
  }

  async findAllForRoutingSheet(routingSheetId: number): Promise<Copy[]> {
    return this.copiesRepository.find({
      where: { routingSheet: { id: routingSheetId } },
      relations: ['recipient'],
    });
  }

  async findOne(id: number): Promise<Copy> {
    const copy = await this.copiesRepository.findOne({ where: { id }, relations: ['routingSheet', 'recipient'] });
    if (!copy) {
      throw new NotFoundException(`Copy with ID ${id} not found`);
    }
    return copy;
  }

  async remove(id: number): Promise<void> {
    const copy = await this.findOne(id); // Throws NotFoundException if not found
    await this.copiesRepository.remove(copy);
  }
}