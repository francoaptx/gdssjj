// src/copies/entities/copy.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { RoutingSheet } from '../../routing-sheets/entities/routing-sheet.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Copy {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => RoutingSheet, rs => rs.copies, { onDelete: 'CASCADE' }) // Si se borra la hoja, se borran sus copias
  @JoinColumn()
  routingSheet: RoutingSheet;

  @ManyToOne(() => User, { eager: true }) // Destinatario de la copia
  @JoinColumn()
  recipient: User;

  @Column()
  provision: string; // Proveído específico para la copia (II.2.1)

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}