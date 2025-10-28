import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';

@Injectable()
export class ShipmentsService {
  constructor(private readonly db: DatabaseService) {}

  async create(createShipmentDto: CreateShipmentDto) {
    return this.db.shipment.create({
      data: {
        ...createShipmentDto,
        date: new Date(createShipmentDto.date),
      },
      include: {
        client: true,
      },
    });
  }

  async findAll(isPaid?: boolean) {
    const where = isPaid !== undefined ? { isPaid } : {};

    return this.db.shipment.findMany({
      where,
      orderBy: { date: 'desc' },
      include: {
        client: true,
      },
    });
  }

  async findOne(id: string) {
    const shipment = await this.db.shipment.findUnique({
      where: { id },
      include: {
        client: true,
      },
    });

    if (!shipment) {
      throw new NotFoundException(`Shipment with ID ${id} not found`);
    }

    return shipment;
  }

  async update(id: string, updateShipmentDto: UpdateShipmentDto) {
    await this.findOne(id);

    return this.db.shipment.update({
      where: { id },
      data: {
        ...updateShipmentDto,
        date: updateShipmentDto.date ? new Date(updateShipmentDto.date) : undefined,
      },
      include: {
        client: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.db.shipment.delete({
      where: { id },
    });
  }

  async markAsPaid(id: string) {
    await this.findOne(id);
    return this.db.shipment.update({
      where: { id },
      data: { isPaid: true },
      include: {
        client: true,
      },
    });
  }

  async getUnpaidShipments() {
    return this.db.shipment.findMany({
      where: { isPaid: false },
      orderBy: { date: 'desc' },
      include: {
        client: true,
      },
    });
  }
}
