import { Controller, Get, Query } from '@nestjs/common'
import { DashboardService } from './dashboard.service'
import { DashboardResponse } from './dashboard.response'

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('/wallet')
  async getDashboardData(@Query('walletId') walletId: string): Promise<DashboardResponse> {
    return await this.dashboardService.getDashboardData(walletId)
  }
}
