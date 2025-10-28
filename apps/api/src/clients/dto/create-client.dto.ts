import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty({ example: 'ООО "Ресторан"' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: '+79001234567' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'client@example.com' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'Постоянный клиент' })
  @IsString()
  @IsOptional()
  notes?: string;
}
