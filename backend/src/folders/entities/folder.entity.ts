// src/folders/entities/folder.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { RoutingSheet } from '../../routing-sheets/entities/routing-sheet.entity';

@Entity()
export class Folder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // No editable después de crearlo (IV.2.3)

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => User, { eager: true }) // Quien creó la carpeta
  @JoinColumn()
  createdBy: User;

  @OneToMany(() => RoutingSheet, rs => rs.archivedFolder)
  archivedRoutingSheets: RoutingSheet[];
}