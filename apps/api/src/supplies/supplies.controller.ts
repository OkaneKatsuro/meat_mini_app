import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SuppliesService } from './supplies.service';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { UpdateSupplyDto } from './dto/update-supply.dto';

@ApiTags('supplies')
@Controller('supplies')
export class SuppliesController {
  constructor(private readonly suppliesService: SuppliesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new supply' })
  create(@Body() createSupplyDto: CreateSupplyDto) {
    return this.suppliesService.create(createSupplyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all supplies' })
  findAll() {
    return this.suppliesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a supply by ID' })
  findOne(@Param('id') id: string) {
    return this.suppliesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a supply' })
  update(@Param('id') id: string, @Body() updateSupplyDto: UpdateSupplyDto) {
    return this.suppliesService.update(id, updateSupplyDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a supply' })
  remove(@Param('id') id: string) {
    return this.suppliesService.remove(id);
  }
}
