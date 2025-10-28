import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { UpdateSupplyDto } from './dto/update-supply.dto';

@Injectable()
export class SuppliesService {
  constructor(private readonly db: DatabaseService) {}

  async create(createSupplyDto: CreateSupplyDto) {
    return this.db.supply.create({
      data: {
        ...createSupplyDto,
        date: new Date(createSupplyDto.date),
      },
    });
  }

  async findAll() {
    return this.db.supply.findMany({
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string) {
    const supply = await this.db.supply.findUnique({
      where: { id },
    });

    if (!supply) {
      throw new NotFoundException(`Supply with ID ${id} not found`);
    }

    return supply;
  }

  async update(id: string, updateSupplyDto: UpdateSupplyDto) {
    await this.findOne(id);

    return this.db.supply.update({
      where: { id },
      data: {
        ...updateSupplyDto,
        date: updateSupplyDto.date ? new Date(updateSupplyDto.date) : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.db.supply.delete({
      where: { id },
    });
  }
}
