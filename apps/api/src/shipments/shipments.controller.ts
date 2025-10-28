import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ShipmentsService } from './shipments.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';

@ApiTags('shipments')
@Controller('shipments')
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new shipment' })
  create(@Body() createShipmentDto: CreateShipmentDto) {
    return this.shipmentsService.create(createShipmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all shipments' })
  @ApiQuery({ name: 'isPaid', required: false, type: Boolean })
  findAll(@Query('isPaid') isPaid?: string) {
    const isPaidBoolean = isPaid === 'true' ? true : isPaid === 'false' ? false : undefined;
    return this.shipmentsService.findAll(isPaidBoolean);
  }

  @Get('unpaid')
  @ApiOperation({ summary: 'Get all unpaid shipments' })
  getUnpaidShipments() {
    return this.shipmentsService.getUnpaidShipments();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a shipment by ID' })
  findOne(@Param('id') id: string) {
    return this.shipmentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a shipment' })
  update(@Param('id') id: string, @Body() updateShipmentDto: UpdateShipmentDto) {
    return this.shipmentsService.update(id, updateShipmentDto);
  }

  @Patch(':id/mark-paid')
  @ApiOperation({ summary: 'Mark shipment as paid' })
  markAsPaid(@Param('id') id: string) {
    return this.shipmentsService.markAsPaid(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a shipment' })
  remove(@Param('id') id: string) {
    return this.shipmentsService.remove(id);
  }
}
