import { Injectable, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { RoutingSheet } from './entities/routing-sheet.entity';
import { CreateRoutingSheetDto } from './dto/create-routing-sheet.dto';
import { UpdateRoutingSheetDto } from './dto/update-routing-sheet.dto';
import { HistoryService } from '../history/history.service';
import { User } from '../users/entities/user.entity';
import { Cite } from '../cites/entities/cite.entity';
import { Folder } from '../folders/entities/folder.entity';
import { CopiesService } from '../copies/copies.service';


@Injectable()
export class RoutingSheetsService {
  constructor(
    @InjectRepository(RoutingSheet)
    private routingSheetsRepository: Repository<RoutingSheet>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Cite)
    private citesRepository: Repository<Cite>,
    @InjectRepository(Folder)
    private foldersRepository: Repository<Folder>,
    private historyService: HistoryService,
    @Inject(forwardRef(() => CopiesService))
    private copiesService: CopiesService,
  ) {}

  async create(createRoutingSheetDto: CreateRoutingSheetDto, senderId: number): Promise<RoutingSheet> {
    // Verificar que el remitente existe
    const sender = await this.usersRepository.findOne({ where: { id: senderId } });
    if (!sender) {
      throw new BadRequestException('Sender not found');
    }

    // Verificar que el destinatario existe
    const recipient = await this.usersRepository.findOne({ where: { id: createRoutingSheetDto.recipientId } });
    if (!recipient) {
      throw new BadRequestException('Recipient not found');
    }

    // Verificar que el cite existe si se proporciona
    let cite: Cite | null = null;
    if (createRoutingSheetDto.citeId) {
      cite = await this.citesRepository.findOne({ where: { id: createRoutingSheetDto.citeId } });
      if (!cite) {
        throw new BadRequestException('Cite not found');
      }
    }

    // Si tiene cite pero no se proporcionó un citeId, crear un nuevo cite
    if (createRoutingSheetDto.hasCite && !cite) {
      // Generar número de cite único secuencial
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      
      // Contar cites existentes este año para generar el siguiente número
      const count = await this.citesRepository.count({
        where: {
          createdAt: MoreThanOrEqual(new Date(year, 0, 1))
        }
      });
      
      // Formato: HR-CITE-XXXX-YYYY (XXXX es número secuencial, YYYY es el año)
      const citeNumber = `HR-CITE-${String(count + 1).padStart(4, '0')}-${year}`;
      
      cite = this.citesRepository.create({
        number: citeNumber,
        subject: createRoutingSheetDto.reference || 'Sin referencia',
        createdBy: sender,
        isUploaded: false, // Initially not uploaded
        createdAt: new Date(),
      });
      cite = await this.citesRepository.save(cite);
    }

    // Generar número de hoja de ruta único
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const count = await this.routingSheetsRepository.count({
      where: {
        createdAt: MoreThanOrEqual(new Date(year, 0, 1))
      }
    });
    
    // Formato: HR-XXXX-YYYY (XXXX es número secuencial, YYYY es el año)
    const routingSheetNumber = `HR-${String(count + 1).padStart(4, '0')}-${year}`;

    // Crear la hoja de ruta
    const routingSheet = this.routingSheetsRepository.create({
      number: routingSheetNumber,
      sender,
      recipient,
      reference: createRoutingSheetDto.reference || null,
      provision: createRoutingSheetDto.provision || 'Sin provisión',
      date: createRoutingSheetDto.date ? new Date(createRoutingSheetDto.date) : new Date(),
      attachments: createRoutingSheetDto.attachments,
      cite: cite || null,
      numberOfPages: createRoutingSheetDto.numberOfPages,
      numberOfAttachments: createRoutingSheetDto.numberOfAttachments,
      hasCite: createRoutingSheetDto.hasCite,
      priority: createRoutingSheetDto.priority,
      status: 'PENDING',
      createdAt: new Date(),
    });

    const savedRoutingSheet = await this.routingSheetsRepository.save(routingSheet);

    // Registrar en el historial
    await this.historyService.logAction(savedRoutingSheet.id, senderId, 'SENT');

    // Crear copias si existen
    if (createRoutingSheetDto.copies && createRoutingSheetDto.copies.length > 0) {
      for (const copyDto of createRoutingSheetDto.copies) {
        await this.copiesService.create(savedRoutingSheet.id, copyDto.recipientId, copyDto.provision);
      }
    }


    return savedRoutingSheet;
  }

  async findAll(): Promise<RoutingSheet[]> {
    return this.routingSheetsRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<RoutingSheet> {
    if (isNaN(id)) {
      throw new BadRequestException('El ID de la hoja de ruta no es válido.');
    }

    const routingSheet = await this.routingSheetsRepository.findOne({ 
      where: { id },
      relations: ['sender', 'recipient', 'cite', 'copies', 'groupedAsMain', 'groupedAsSecondary', 'histories', 'archivedFolder']
    });

    if (!routingSheet) {
      throw new BadRequestException('Routing sheet not found');
    }

    return routingSheet;
  }

  async receive(id: number, userId: number): Promise<RoutingSheet> {
    const routingSheet = await this.findOne(id);

    // Verificar que el usuario es el destinatario
    if (routingSheet.recipient.id !== userId) {
      throw new BadRequestException('Only the recipient can receive the routing sheet');
    }

    // Verificar que esté en estado PENDIENTE
    if (routingSheet.status !== 'PENDING') {
      throw new BadRequestException('Routing sheet is not in PENDING status');
    }

    routingSheet.status = 'RECEIVED';
    routingSheet.receivedAt = new Date();

    const savedRS = await this.routingSheetsRepository.save(routingSheet);

    // Registrar en el historial
    await this.historyService.logAction(id, userId, 'RECEIVED');

    return savedRS;
  }

  async process(id: number, userId: number, updateRoutingSheetDto: UpdateRoutingSheetDto): Promise<RoutingSheet> {
    const routingSheet = await this.findOne(id);

    // Verificar que el usuario es el destinatario
    if (routingSheet.recipient.id !== userId) {
      throw new BadRequestException('Only the recipient can process the routing sheet');
    }

    // Verificar que esté en estado RECIBIDO o PENDIENTE
    if (routingSheet.status !== 'RECEIVED' && routingSheet.status !== 'PENDING') {
      throw new BadRequestException('Routing sheet must be RECEIVED or PENDING to be processed');
    }

    // Si hay nuevos destinatarios, cambiar el estado a PENDIENTE y asignar nuevo destinatario
    if (updateRoutingSheetDto.recipientId) {
      const newRecipient = await this.usersRepository.findOne({ where: { id: updateRoutingSheetDto.recipientId } });
      if (!newRecipient) {
        throw new BadRequestException('New recipient not found');
      }

      routingSheet.status = 'PENDING';
      routingSheet.recipient = newRecipient;
      routingSheet.processedAt = new Date();

      // Registrar en el historial
      await this.historyService.logAction(id, userId, 'PROCESSED');
      await this.historyService.logAction(id, userId, 'SENT'); // Se envía al nuevo destinatario
    } else {
      // Si no hay nuevos destinatarios, marcar como procesada
      routingSheet.status = 'PROCESSED';
      routingSheet.processedAt = new Date();

      // Registrar en el historial
      await this.historyService.logAction(id, userId, 'PROCESSED');
    }

    return this.routingSheetsRepository.save(routingSheet);
  }

  async archive(id: number, userId: number, folderId: number): Promise<RoutingSheet> {
    const routingSheet = await this.findOne(id);

    // Verificar que el usuario es el destinatario
    if (routingSheet.recipient.id !== userId) {
      throw new BadRequestException('Only the recipient can archive the routing sheet');
    }

    // Verificar que esté en estado RECIBIDO o PENDIENTE
    if (routingSheet.status !== 'RECEIVED' && routingSheet.status !== 'PENDING') {
      throw new BadRequestException('Routing sheet must be RECEIVED or PENDING to be archived');
    }

    // Verificar que la carpeta existe
    const folder = await this.foldersRepository.findOne({ where: { id: folderId } });
    if (!folder) {
      throw new BadRequestException('Folder not found');
    }

    routingSheet.archivedFolder = folder;
    routingSheet.status = 'ARCHIVED';
    routingSheet.archivedAt = new Date();
    routingSheet.processedAt = new Date(); // Fecha de procesamiento final

    const savedRS = await this.routingSheetsRepository.save(routingSheet);

    // Registrar en el historial
    await this.historyService.logAction(id, userId, 'ARCHIVED');

    return savedRS;
  }

  async unarchive(id: number, userId: number): Promise<RoutingSheet> {
    const routingSheet = await this.findOne(id);

    // Verificar que el usuario es el destinatario
    if (routingSheet.recipient.id !== userId) {
      throw new BadRequestException('Only the recipient can unarchive the routing sheet');
    }

    // Verificar que esté archivada
    if (routingSheet.status !== 'ARCHIVED') {
      throw new BadRequestException('Routing sheet is not archived');
    }

    routingSheet.status = 'PENDING';
    routingSheet.archivedFolder = undefined;
    routingSheet.archivedAt = undefined;
    routingSheet.processedAt = undefined; // Reiniciar fecha de procesamiento final

    const savedRS = await this.routingSheetsRepository.save(routingSheet);

    // Registrar en el historial
    await this.historyService.logAction(id, userId, 'UNARCHIVED');

    return savedRS;
  }

  async cancel(id: number, userId: number): Promise<RoutingSheet> {
    const routingSheet = await this.findOne(id);

    // Verificar que el usuario es el remitente
    if (routingSheet.sender.id !== userId) {
      throw new BadRequestException('Only the sender can cancel the routing sheet');
    }

    // Verificar que esté en estado PENDIENTE
    if (routingSheet.status !== 'PENDING') {
      throw new BadRequestException('Only PENDING routing sheets can be cancelled');
    }

    routingSheet.status = 'CANCELLED';
    routingSheet.cancelledAt = new Date();

    const savedRS = await this.routingSheetsRepository.save(routingSheet);

    // Registrar en el historial
    await this.historyService.logAction(id, userId, 'CANCELLED');

    return savedRS;
  }

  async findPendingByUser(userId: number): Promise<RoutingSheet[]> {
    return this.routingSheetsRepository.find({
      where: [
        { recipient: { id: userId }, status: 'PENDING' },
        { recipient: { id: userId }, status: 'RECEIVED' }
      ],
      order: { createdAt: 'DESC' },
      relations: ['sender', 'recipient', 'cite']
    });
  }

  async findSentByUser(userId: number): Promise<RoutingSheet[]> {
    return this.routingSheetsRepository.find({
      where: { sender: { id: userId } }, // Todas las enviadas por el usuario
      order: { createdAt: 'DESC' },
      relations: ['sender', 'recipient', 'cite']
    });
  }

  async findReceivedByUser(userId: number): Promise<RoutingSheet[]> {
    return this.routingSheetsRepository.find({
      where: { recipient: { id: userId }, status: 'RECEIVED' }, // Corregido: debe ser recipient, no sender
      order: { receivedAt: 'DESC' },
      relations: ['sender', 'recipient', 'cite']
    });
  }

  async findArchivedByUser(userId: number): Promise<RoutingSheet[]> {
    return this.routingSheetsRepository.find({
      where: { recipient: { id: userId }, status: 'ARCHIVED' },
      order: { archivedAt: 'DESC' },
      relations: ['sender', 'recipient', 'cite']
    });
  }

  async findUnreceivedPendingByUser(userId: number): Promise<RoutingSheet[]> {
    return this.routingSheetsRepository.find({
      where: { recipient: { id: userId }, status: 'PENDING' },
      order: { createdAt: 'DESC' },
      relations: ['sender', 'recipient', 'cite']
    });
  }

  async findByRecipient(recipientId: number): Promise<RoutingSheet[]> {
    return this.routingSheetsRepository.find({
      where: { recipient: { id: recipientId } },
      order: { createdAt: 'DESC' },
      relations: ['sender', 'recipient', 'cite']
    });
  }

  async remove(id: number): Promise<void> {
    await this.routingSheetsRepository.delete(id);
  }

  async logHistory(routingSheetId: number, userId: number, action: string): Promise<void> {
    await this.historyService.logAction(routingSheetId, userId, action);
  }
}