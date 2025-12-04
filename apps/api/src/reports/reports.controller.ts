import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
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

  @Get('period/csv')
  @ApiOperation({ summary: 'Download period report as CSV' })
  @ApiQuery({ name: 'startDate', example: '2024-01-01' })
  @ApiQuery({ name: 'endDate', example: '2024-01-31' })
  async downloadPeriodReportCsv(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<string> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const csv = await this.reportsService.generatePeriodReportCsv(start, end);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="period-report_${startDate}_${endDate}.csv"`,
    );

    return csv;
  }
}
