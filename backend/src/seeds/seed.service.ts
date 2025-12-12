// src/seeds/seed.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../roles/entities/role.entity';
import { Office } from '../offices/entities/office.entity';
import { Position } from '../positions/entities/position.entity';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Office)
    private officeRepository: Repository<Office>,
    @InjectRepository(Position)
    private positionRepository: Repository<Position>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async run() {
    console.log('Iniciando proceso de seeding...');

    // Verificar si ya existen datos
    const existingRoles = await this.roleRepository.count();
    const existingOffices = await this.officeRepository.count();
    const existingPositions = await this.positionRepository.count();
    const existingUsers = await this.userRepository.count();

    if (existingRoles > 0 || existingOffices > 0 || existingPositions > 0 || existingUsers > 0) {
      console.log('Los datos ya existen en la base de datos. Saltando seeding.');
      return;
    }

    // Crear roles
    const roles = await this.seedRoles();
    console.log('Roles creados/verificados.');

    // Crear oficinas
    const offices = await this.seedOffices();
    console.log('Oficinas creadas/verificadas.');

    // Crear posiciones
    await this.seedPositions();
    console.log('Posiciones creadas/verificadas.');

    // Crear usuarios
    await this.seedUsers(roles, offices);
    console.log('Usuarios creados/verificados.');

    console.log('Proceso de seeding completado.');
  }

  private async seedRoles(): Promise<Role[]> {
    const rolesData = [
      { name: 'ADMIN' },
      { name: 'USER' },
      { name: 'SYSTEM_ADMIN' }, // Nuevo ejemplo
      { name: 'SECRETARY' },    // Nuevo ejemplo
    ];

    const roles: Role[] = [];
    for (const roleData of rolesData) {
      const existingRole = await this.roleRepository.findOne({ where: { name: roleData.name } });
      if (!existingRole) {
        const role = this.roleRepository.create(roleData);
        roles.push(await this.roleRepository.save(role));
      } else {
        roles.push(existingRole);
      }
    }

    return roles;
  }

  private async seedOffices(): Promise<Office[]> {
    const officesData = [
      { name: 'Oficina Central' },
      { name: 'Departamento de Recursos Humanos' },
      { name: 'Departamento Financiero' },
      { name: 'Departamento de Sistemas' },
    ];

    const offices: Office[] = [];
    for (const officeData of officesData) {
      const existingOffice = await this.officeRepository.findOne({ where: { name: officeData.name } });
      if (!existingOffice) {
        const office = this.officeRepository.create(officeData);
        offices.push(await this.officeRepository.save(office));
      } else {
        offices.push(existingOffice);
      }
    }

    return offices;
  }

  private async seedPositions(): Promise<void> {
    const positionsData = [
      { name: 'Gerente', description: 'Responsable de supervisar operaciones' },
      { name: 'Analista', description: 'Encargado de análisis y reportes' },
      { name: 'Asistente', description: 'Soporte administrativo general' },
      { name: 'Director', description: 'Director de departamento' },
    ];

    for (const positionData of positionsData) {
      const existingPosition = await this.positionRepository.findOne({ where: { name: positionData.name } });
      if (!existingPosition) {
        const position = this.positionRepository.create(positionData);
        await this.positionRepository.save(position);
      }
    }
  }

  private async seedUsers(roles: Role[], offices: Office[]): Promise<void> {
    // Crear usuario admin por defecto
    const adminUser = await this.userRepository.findOne({ where: { username: 'admin' } });
    if (!adminUser) {
      const adminRole = roles.find(role => role.name === 'ADMIN');
      const centralOffice = offices.find(office => office.name === 'Oficina Central');
      const gerentePosition = await this.positionRepository.findOne({ where: { name: 'Gerente' } });

      if (adminRole && centralOffice && gerentePosition) {
        const user = this.userRepository.create({
          name: 'Administrador',
          username: 'admin',
          password: await bcrypt.hash('admin123', 10),
          role: adminRole,
          office: centralOffice,
          position: gerentePosition,
          contract: 'Contrato indefinido',
        });

        await this.userRepository.save(user);
      }
    }
  }
}