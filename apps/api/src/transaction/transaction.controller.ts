import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { TransactionService } from './transaction.service'
import { CreateTransactionDto, UpdateTransactionDto } from './transaction.dto'

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('/wallet/:walletId')
  async findBalancedByWallet(
    @Param('walletId') walletId: string,
    @Query('take') take: string,
    @Query('skip') skip: string
  ) {
    return await this.transactionService.findBalancedByWalletId(
      walletId,
      Number(take),
      Number(skip)
    )
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
