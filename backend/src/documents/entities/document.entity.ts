// src/documents/entities/document.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Cite } from '../../cites/entities/cite.entity';
import { RoutingSheet } from '../../routing-sheets/entities/routing-sheet.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string; // Nombre del archivo subido

  @Column()
  path: string; // Ruta donde se guarda el archivo en el servidor

  @Column()
  mimeType: string; // Tipo MIME del archivo

  @Column()
  size: number; // Tamaño del archivo en bytes

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  uploadedAt: Date;

  @ManyToOne(() => Cite, cite => cite.documents, { eager: true }) // eager: true para cargar el cite al obtener el doc
  @JoinColumn()
  cite: Cite;

  @ManyToOne(() => RoutingSheet, routingSheet => routingSheet.documents, { eager: true })
  @JoinColumn()
  routingSheet: RoutingSheet;

  @ManyToOne(() => User, { eager: true }) // Quien subió el doc
  @JoinColumn()
  uploadedBy: User;
}