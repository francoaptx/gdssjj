import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Office } from '../offices/entities/office.entity';
import { Role } from '../roles/entities/role.entity';
import { Position } from '../positions/entities/position.entity';
import { OfficesService } from '../offices/offices.service';
import { RolesService } from '../roles/roles.service';
import { PositionsService } from '../positions/positions.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private officesService: OfficesService,
    private rolesService: RolesService,
    private positionsService: PositionsService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Verificar que la oficina, rol y posición existen
    const office = await this.officesService.findOne(createUserDto.officeId);
    if (!office) {
      throw new BadRequestException('Office not found');
    }

    const role = await this.rolesService.findOne(createUserDto.roleId);
    if (!role) {
      throw new BadRequestException('Role not found');
    }

    const position = await this.positionsService.findOne(createUserDto.positionId);
    if (!position) {
      throw new BadRequestException('Position not found');
    }

    // Verificar que el nombre de usuario no esté en uso
    const existingUser = await this.usersRepository.findOne({
      where: { username: createUserDto.username }
    });
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Crear el usuario
    const user = this.usersRepository.create({
      name: createUserDto.name,
      username: createUserDto.username,
      password: hashedPassword,
      office,
      role,
      position,
      contract: createUserDto.contract
    });

    return this.usersRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find({ relations: ['office', 'role', 'position'] });
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOne({ 
      where: { id },
      relations: ['office', 'role', 'position']
    });
  }

  findByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({ 
      where: { username },
      relations: ['office', 'role', 'position']
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    // Construir objeto de actualización con solo las propiedades definidas
    const updateData: any = {};
    
    // Copiar solo las propiedades definidas del DTO al objeto de actualización
    Object.keys(updateUserDto).forEach(key => {
      if (updateUserDto[key] !== undefined) {
        updateData[key] = updateUserDto[key];
      }
    });

    // Verificar que la oficina existe si se proporciona
    if (updateUserDto.officeId !== undefined) {
      const office = await this.officesService.findOne(updateUserDto.officeId);
      if (!office) {
        throw new BadRequestException('Office not found');
      }
      updateData.office = office;
    }

    // Verificar que el rol existe si se proporciona
    if (updateUserDto.roleId !== undefined) {
      const role = await this.rolesService.findOne(updateUserDto.roleId);
      if (!role) {
        throw new BadRequestException('Role not found');
      }
      updateData.role = role;
    }

    // Verificar que la posición existe si se proporciona
    if (updateUserDto.positionId !== undefined) {
      const position = await this.positionsService.findOne(updateUserDto.positionId);
      if (!position) {
        throw new BadRequestException('Position not found');
      }
      updateData.position = position;
    }

    // Hashear la contraseña si se proporciona
    if (updateUserDto.password !== undefined) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.usersRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}