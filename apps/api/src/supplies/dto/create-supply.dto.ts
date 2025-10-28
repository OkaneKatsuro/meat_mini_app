import { IsEnum, IsInt, IsDateString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MeatType, PackageSize } from '@repo/database';

export class CreateSupplyDto {
  @ApiProperty({ example: '2024-01-15T10:00:00.000Z' })
  @IsDateString()
  date: string;

  @ApiProperty({ enum: MeatType, example: MeatType.CHICKEN })
  @IsEnum(MeatType)
  meatType: MeatType;

  @ApiProperty({ enum: PackageSize, example: PackageSize.SIZE_15 })
  @IsEnum(PackageSize)
  packageSize: PackageSize;

  @ApiProperty({ example: 100, description: 'Количество упаковок' })
  @IsInt()
  @Min(1)
  quantity: number;
}
