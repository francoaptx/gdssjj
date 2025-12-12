import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { Cite } from '../cites/entities/cite.entity';
import { RoutingSheet } from '../routing-sheets/entities/routing-sheet.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
    @InjectRepository(Cite)
    private citesRepository: Repository<Cite>,
    @InjectRepository(RoutingSheet)
    private routingSheetsRepository: Repository<RoutingSheet>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async uploadDocumentToCite(citeId: number, userId: number, file: Express.Multer.File): Promise<Document> {
    const cite = await this.citesRepository.findOne({ where: { id: citeId } });
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!cite) {
      throw new Error('Cite not found');
    }

    if (!user) {
      throw new Error('User not found');
    }

    const document = this.documentsRepository.create({
      filename: file.originalname,
      path: file.path,
      mimeType: file.mimetype,
      size: file.size,
      uploadedBy: user,
      cite: cite,
    });

    return this.documentsRepository.save(document);
  }

  async uploadDocumentToRoutingSheet(routingSheetId: number, userId: number, file: Express.Multer.File): Promise<Document> {
    const routingSheet = await this.routingSheetsRepository.findOne({ where: { id: routingSheetId } });
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!routingSheet) {
      throw new Error('Routing sheet not found');
    }

    if (!user) {
      throw new Error('User not found');
    }

    const document = this.documentsRepository.create({
      filename: file.originalname,
      path: file.path,
      mimeType: file.mimetype,
      size: file.size,
      uploadedBy: user,
      routingSheet: routingSheet,
    });

    return this.documentsRepository.save(document);
  }

  async findOne(id: number): Promise<Document> {
    return this.documentsRepository.findOne({ 
      where: { id },
      relations: ['uploadedBy', 'cite', 'routingSheet']
    });
  }

  async remove(id: number): Promise<void> {
    await this.documentsRepository.delete(id);
  }
}