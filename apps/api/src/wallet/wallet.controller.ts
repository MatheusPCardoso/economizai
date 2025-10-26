import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common'
import { WalletService } from './wallet.service'
import { CreateWalletDto, UpdateWalletDto } from './wallet.dto'

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('/authId')
  async find(@Query('authId') authId: string) {
    return await this.walletService.findByAuthId(authId)
  }

  @Post('/create')
  async create(@Body() data: CreateWalletDto) {
    return await this.walletService.create(data)
  }

  @Post('/delete/:id')
  async delete(@Param('id') id: string) {
    return await this.walletService.delete(id)
  }

  @Put('/update')
  async update(@Body() data: UpdateWalletDto) {
    return await this.walletService.update(data)
  }
}
