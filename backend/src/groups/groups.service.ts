import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { RoutingSheet } from '../routing-sheets/entities/routing-sheet.entity';
import { RoutingSheetsService } from '../routing-sheets/routing-sheets.service';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupsRepository: Repository<Group>,
    @InjectRepository(RoutingSheet)
    private routingSheetsRepository: Repository<RoutingSheet>,
    private routingSheetsService: RoutingSheetsService,
  ) {}

  async create(mainSheetId: number, groupedSheetId: number): Promise<Group> {
    // Verificar que ambas hojas de ruta existen
    const mainSheet = await this.routingSheetsRepository.findOne({ where: { id: mainSheetId } });
    const groupedSheet = await this.routingSheetsRepository.findOne({ where: { id: groupedSheetId } });

    if (!mainSheet) {
      throw new BadRequestException('Main routing sheet not found');
    }

    if (!groupedSheet) {
      throw new BadRequestException('Grouped routing sheet not found');
    }

    // Verificar que ambas hojas estén en estado PENDIENTE
    if (mainSheet.status !== 'PENDING') {
      throw new BadRequestException('Main routing sheet must be in PENDING status');
    }

    if (groupedSheet.status !== 'PENDING') {
      throw new BadRequestException('Grouped routing sheet must be in PENDING status');
    }

    // Verificar que no estén ya agrupadas
    const existingGroup = await this.groupsRepository.findOne({
      where: [
        { mainRoutingSheet: { id: mainSheetId }, secondaryRoutingSheet: { id: groupedSheetId } },
        { mainRoutingSheet: { id: groupedSheetId }, secondaryRoutingSheet: { id: mainSheetId } }
      ]
    });

    if (existingGroup) {
      throw new BadRequestException('These routing sheets are already grouped');
    }

    // Crear el grupo
    const group = this.groupsRepository.create({
      mainRoutingSheet: mainSheet,
      secondaryRoutingSheet: groupedSheet,
    });

    const savedGroup = await this.groupsRepository.save(group);

    // Registrar en el historial
    await this.routingSheetsService.logHistory(mainSheetId, mainSheet.sender.id, 'GROUPED');
    await this.routingSheetsService.logHistory(groupedSheetId, groupedSheet.sender.id, 'GROUPED');

    return savedGroup;
  }

  async findAll(): Promise<Group[]> {
    return this.groupsRepository.find({ relations: ['mainRoutingSheet', 'secondaryRoutingSheet'] });
  }

  async findOne(id: number): Promise<Group> {
    return this.groupsRepository.findOne({ 
      where: { id },
      relations: ['mainRoutingSheet', 'secondaryRoutingSheet'] 
    });
  }

  async remove(id: number): Promise<void> {
    const group = await this.groupsRepository.findOne({ 
      where: { id },
      relations: ['mainRoutingSheet', 'secondaryRoutingSheet'] 
    });

    if (!group) {
      throw new BadRequestException('Group not found');
    }

    // Registrar en el historial
    await this.routingSheetsService.logHistory(
      group.mainRoutingSheet.id, 
      group.mainRoutingSheet.sender.id, 
      'UNGROUPED'
    );
    
    await this.routingSheetsService.logHistory(
      group.secondaryRoutingSheet.id, 
      group.secondaryRoutingSheet.sender.id, 
      'UNGROUPED'
    );

    await this.groupsRepository.delete(id);
  }
}