import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DashboardService, InventoryItem, DebtorInfo } from './dashboard.service';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({ summary: 'Get complete dashboard data' })
  getDashboard() {
    return this.dashboardService.getDashboard();
  }

  @Get('inventory')
  @ApiOperation({ summary: 'Get current inventory status' })
  getInventory(): Promise<InventoryItem[]> {
    return this.dashboardService.getInventory();
  }

  @Get('debtors')
  @ApiOperation({ summary: 'Get list of debtors' })
  getDebtors(): Promise<DebtorInfo[]> {
    return this.dashboardService.getDebtors();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get general statistics' })
  getStats() {
    return this.dashboardService.getStats();
  }
}
