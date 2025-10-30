import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { TransactionService } from './transaction.service'
import { CreateTransactionDto, UpdateTransactionDto } from './transaction.dto'

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('/wallet/:walletId')
  async getLastTwelveMonthsTransactions(@Param('walletId') walletId: string) {
    return await this.transactionService.findBalancedByWalletId(walletId)
  }

  @Post()
  async create(@Body() data: CreateTransactionDto) {
    return await this.transactionService.create(data)
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() data: UpdateTransactionDto) {
    return await this.transactionService.update(id, data)
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return await this.transactionService.delete(id)
  }
}
