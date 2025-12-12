import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Office } from '../../offices/entities/office.entity';
import { Role } from '../../roles/entities/role.entity';
import { RoutingSheet } from '../../routing-sheets/entities/routing-sheet.entity';
import { Position } from '../../positions/entities/position.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string; // Debe ser hash

  @ManyToOne(() => Office, office => office.users)
  @JoinColumn()
  office: Office;

  @ManyToOne(() => Role, role => role.users)
  @JoinColumn()
  role: Role;

  @ManyToOne(() => Position, position => position.users)
  @JoinColumn()
  position: Position;

  @Column({ nullable: true })
  contract?: string;

  @OneToMany(() => RoutingSheet, routingSheet => routingSheet.sender)
  sentRoutingSheets: RoutingSheet[];

  @OneToMany(() => RoutingSheet, routingSheet => routingSheet.recipient)
  receivedRoutingSheets: RoutingSheet[];
}