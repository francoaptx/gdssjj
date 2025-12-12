// src/history/entities/history.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { RoutingSheet } from '../../routing-sheets/entities/routing-sheet.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class History {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => RoutingSheet, rs => rs.histories, { onDelete: 'CASCADE' })
  @JoinColumn()
  routingSheet: RoutingSheet;

  @ManyToOne(() => User, { eager: true }) // Usuario involucrado en el evento
  @JoinColumn()
  user: User;

  @Column()
  action: string; // Ej: 'SENT', 'RECEIVED', 'PROCESSED', 'ARCHIVED', 'DERIVED', 'GROUPED', 'UNGROUPED', 'CANCELLED'

  @Column({ nullable: true })
  notes: string; // Notas adicionales sobre la acción

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}