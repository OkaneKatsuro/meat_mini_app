import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly db: DatabaseService) {}

  async create(createClientDto: CreateClientDto) {
    return this.db.client.create({
      data: createClientDto,
    });
  }

  async findAll() {
    return this.db.client.findMany({
      orderBy: { name: 'asc' },
      include: {
        shipments: {
          orderBy: { date: 'desc' },
          take: 5,
        },
      },
    });
  }

  async findOne(id: string) {
    const client = await this.db.client.findUnique({
      where: { id },
      include: {
        shipments: {
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    await this.findOne(id);

    return this.db.client.update({
      where: { id },
      data: updateClientDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.db.client.delete({
      where: { id },
    });
  }
}