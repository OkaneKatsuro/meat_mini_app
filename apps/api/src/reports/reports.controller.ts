import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ReportsService, PeriodReport } from './reports.service';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('period')
  @ApiOperation({ summary: 'Generate report for specified period' })
  @ApiQuery({ name: 'startDate', example: '2024-01-01' })
  @ApiQuery({ name: 'endDate', example: '2024-01-31' })
  async generatePeriodReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<PeriodReport> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return this.reportsService.generatePeriodReport(start, end);
  }
}
