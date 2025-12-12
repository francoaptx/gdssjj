// src/cites/entities/cite.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { RoutingSheet } from '../../routing-sheets/entities/routing-sheet.entity';
import { Document } from '../../documents/entities/document.entity';

@Entity()
export class Cite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  number: string; // Generado automáticamente, ej: HR-CITE-001-2025

  @Column()
  subject: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn()
  createdBy: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: false })
  isUploaded: boolean;

  @Column({ type: 'timestamp', nullable: true })
  uploadedAt: Date;

  @OneToMany(() => RoutingSheet, rs => rs.cite)
  routingSheets: RoutingSheet[];

  @OneToMany(() => Document, document => document.cite)
  documents: Document[];
}