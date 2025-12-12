import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Position } from './entities/position.entity';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(Position)
    private positionsRepository: Repository<Position>,
  ) {}

  create(createPositionDto: CreatePositionDto): Promise<Position> {
    const position = this.positionsRepository.create(createPositionDto);
    return this.positionsRepository.save(position);
  }

  findAll(): Promise<Position[]> {
    return this.positionsRepository.find();
  }

  findOne(id: number): Promise<Position> {
    return this.positionsRepository.findOne({ where: { id } });
  }

  update(id: number, updatePositionDto: UpdatePositionDto): Promise<Position> {
    return this.positionsRepository.save({ id, ...updatePositionDto });
  }

  async remove(id: number): Promise<void> {
    await this.positionsRepository.delete(id);
  }
}