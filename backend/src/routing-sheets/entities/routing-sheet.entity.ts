// src/routing-sheets/entities/routing-sheet.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Cite } from '../../cites/entities/cite.entity';
import { Copy } from '../../copies/entities/copy.entity';
import { Group } from '../../groups/entities/group.entity';
import { History } from '../../history/entities/history.entity';
import { Folder } from '../../folders/entities/folder.entity'; // Nueva relación
import { Document } from '../../documents/entities/document.entity';

@Entity()
export class RoutingSheet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  number: string; // Generado automáticamente, ej: HR-001-2025

  @ManyToOne(() => User, user => user.sentRoutingSheets, { eager: true })
  @JoinColumn()
  sender: User;

  @ManyToOne(() => User, user => user.receivedRoutingSheets, { eager: true })
  @JoinColumn()
  recipient: User;

  @Column()
  reference: string;

  @Column()
  provision: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ nullable: true })
  attachments?: string; // Ruta a archivos adjuntos

  @ManyToOne(() => Cite, cite => cite.routingSheets, { eager: true })
  @JoinColumn()
  cite: Cite;

  @OneToMany(() => Copy, copy => copy.routingSheet)
  copies: Copy[];

  @OneToMany(() => Group, group => group.mainRoutingSheet)
  groupedAsMain: Group[];

  @OneToMany(() => Group, group => group.secondaryRoutingSheet)
  groupedAsSecondary: Group[];

  @OneToMany(() => History, history => history.routingSheet)
  histories: History[];

  @ManyToOne(() => Folder, folder => folder.archivedRoutingSheets, { nullable: true })
  @JoinColumn()
  archivedFolder: Folder;

  @OneToMany(() => Document, document => document.routingSheet)
  documents: Document[];

  // Campos adicionales
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  receivedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  processedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  archivedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date;

  @Column({ nullable: true })
  numberOfPages: number;

  @Column({ nullable: true })
  numberOfAttachments: number;

  @Column({ nullable: true })
  priority: string;

  @Column({ default: false })
  hasCite: boolean;

  @Column({ default: 'PENDING' })
  status: string;
}