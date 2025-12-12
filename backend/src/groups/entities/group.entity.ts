// src/groups/entities/group.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { RoutingSheet } from '../../routing-sheets/entities/routing-sheet.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => RoutingSheet, rs => rs.groupedAsMain, { onDelete: 'CASCADE' }) // Si se borra la hoja principal, se borra el grupo
  @JoinColumn()
  mainRoutingSheet: RoutingSheet; // La hoja de ruta principal que agrupa

  @ManyToOne(() => RoutingSheet, rs => rs.groupedAsSecondary, { onDelete: 'CASCADE' }) // Si se borra la hoja secundaria, se borra del grupo
  @JoinColumn()
  secondaryRoutingSheet: RoutingSheet; // La hoja de ruta agrupada
}