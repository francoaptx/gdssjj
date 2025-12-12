// src/history/history.service.ts
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { History } from './entities/history.entity';
import { RoutingSheet } from '../routing-sheets/entities/routing-sheet.entity';
import { User } from '../users/entities/user.entity';
import { RoutingSheetsService } from '../routing-sheets/routing-sheets.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private historyRepository: Repository<History>,
    @Inject(forwardRef(() => RoutingSheetsService))
    private routingSheetsService: RoutingSheetsService,
    private usersService: UsersService,
  ) {}

  async logAction(routingSheetId: number, userId: number, action: string, notes?: string): Promise<History> {
    const routingSheet = await this.routingSheetsService.findOne(routingSheetId);
    const user = await this.usersService.findOne(userId);

    const historyEntry = this.historyRepository.create({
      routingSheet: routingSheet,
      user: user,
      action: action,
      notes: notes,
    });
    
    return this.historyRepository.save(historyEntry);
  }

  async findAll(): Promise<History[]> {
    return this.historyRepository.find({ relations: ['routingSheet', 'user'] });
  }

  async findOne(id: number): Promise<History> {
    return this.historyRepository.findOne({ 
      where: { id },
      relations: ['routingSheet', 'user'] 
    });
  }

  async findByRoutingSheet(routingSheetId: number): Promise<History[]> {
    return this.historyRepository.find({ 
      where: { routingSheet: { id: routingSheetId } },
      relations: ['routingSheet', 'user'],
      order: { timestamp: 'ASC' }
    });
  }
}