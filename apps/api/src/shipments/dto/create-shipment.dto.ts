import { IsEnum, IsInt, IsDateString, IsString, IsBoolean, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MeatType, PackageSize } from '@repo/database';

export class CreateShipmentDto {
  @ApiProperty({ example: 'client-id-here' })
  @IsString()
  clientId: string;

  @ApiProperty({ example: '2024-01-15T10:00:00.000Z' })
  @IsDateString()
  date: string;

  @ApiProperty({ enum: MeatType, example: MeatType.CHICKEN })
  @IsEnum(MeatType)
  meatType: MeatType;

  @ApiProperty({ enum: PackageSize, example: PackageSize.SIZE_15 })
  @IsEnum(PackageSize)
  packageSize: PackageSize;

  @ApiProperty({ example: 50, description: 'Количество упаковок' })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: false })
  @IsBoolean()
  isPaid: boolean;

  @ApiPropertyOptional({ example: '15000.00' })
  @IsOptional()
  totalAmount?: number;

  @ApiPropertyOptional({ example: 'Доставка до 18:00' })
  @IsString()
  @IsOptional()
  notes?: string;
}
