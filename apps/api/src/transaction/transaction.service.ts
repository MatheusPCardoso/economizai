import { DatabaseService } from '@/database/database.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateTransactionDto, UpdateTransactionDto } from './transaction.dto'
import { TransactionType } from '@prisma/client'
import { startOfDay, subMonths } from 'date-fns'

@Injectable()
export class TransactionService {
  constructor(private readonly dbService: DatabaseService) {}

  async findBalancedByWalletId(walletId: string) {
    const gte = startOfDay(subMonths(new Date(), 12))
    const [incomes, expenses] = await Promise.all([
      this.dbService.transaction.findMany({
        where: { walletId, type: TransactionType.INCOME, createdAt: { gte } },
        orderBy: {
          reference: 'desc',
        },
      }),
      this.dbService.transaction.findMany({
        where: { walletId, type: TransactionType.EXPENSE, createdAt: { gte } },
        orderBy: {
          reference: 'desc',
        },
      }),
    ])

    return [...incomes, ...expenses].sort((a, b) => b.reference.getTime() - a.reference.getTime())
  }

  async create(data: CreateTransactionDto) {
    const { categoryId, subcategoryId, walletId, ...rest } = data

    return await this.dbService.transaction.create({
      data: {
        ...rest,
        wallet: { connect: { id: walletId } },
        category: { connect: { id: categoryId } },
        ...(subcategoryId && {
          subcategory: { connect: { id: subcategoryId } },
        }),
      },
    })
  }

  async update(id: string, data: UpdateTransactionDto) {
    const { categoryId, subcategoryId, ...rest } = data

    const existingTransaction = await this.dbService.transaction.findUnique({
      where: { id },
    })

    if (!existingTransaction) {
      throw new NotFoundException(`Transaction with ID "${id}" not found`)
    }

    return await this.dbService.transaction.update({
      where: { id },
      data: {
        ...rest,
        ...(categoryId && { category: { connect: { id: categoryId } } }),
        ...(subcategoryId && { subcategory: { connect: { id: subcategoryId } } }),
      },
    })
  }

  async delete(id: string) {
    const existingTransaction = await this.dbService.transaction.findUnique({
      where: { id },
    })

    if (!existingTransaction) {
      throw new NotFoundException(`Transaction with ID "${id}" not found`)
    }

    return await this.dbService.transaction.delete({
      where: { id },
    })
  }
}
