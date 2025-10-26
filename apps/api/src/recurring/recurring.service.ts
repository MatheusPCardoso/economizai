import { Injectable } from '@nestjs/common'
import { Recurring, TransactionType } from '@prisma/client'
import { CreateRecurringDto, UpdateRecurringDto } from './recurring-dto'
import { DatabaseService } from '@/database/database.service'
import { NotFoundRecurringError } from './recurring.error'
import { Cron, CronExpression } from '@nestjs/schedule'
import { TransactionService } from '@/transaction/transaction.service'
import { differenceInDays } from 'date-fns'

@Injectable()
export class RecurringService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly transactionService: TransactionService
  ) {}

  async create(data: CreateRecurringDto): Promise<Recurring> {
    const { walletId, categoryId, subcategoryId, generateFirst, ...rest } = data

    const startDate = new Date(data.startDate)
    startDate.setHours(0, 0, 0, 0)

    const recurring = await this.dbService.recurring.create({
      data: {
        ...rest,
        startDate,
        wallet: { connect: { id: walletId } },
        category: { connect: { id: categoryId } },
        ...(subcategoryId && {
          subcategory: { connect: { id: subcategoryId } },
        }),
      },
    })

    if (generateFirst) {
      await this._createTransactionFromRecurring(recurring)
    }

    return recurring
  }

  async findAllByWalletId(walletId: string): Promise<Recurring[]> {
    const recurrings = await this.dbService.recurring.findMany({
      where: { walletId },
    })

    return recurrings
  }

  async update(id: string, data: UpdateRecurringDto): Promise<Recurring> {
    const { id: dtoId, walletId, categoryId, subcategoryId, ...rest } = data

    const prismaData = {
      ...rest,
      ...(walletId && { wallet: { connect: { id: walletId } } }),
      ...(categoryId && { category: { connect: { id: categoryId } } }),
      ...(subcategoryId && { subcategory: { connect: { id: subcategoryId } } }),
    }

    const existingRecurring = await this.dbService.recurring.findUnique({ where: { id } })
    if (!existingRecurring) {
      throw new NotFoundRecurringError()
    }

    return this.dbService.recurring.update({
      where: { id },
      data: prismaData,
    })
  }

  async remove(id: string): Promise<void> {
    const existingRecurring = await this.dbService.recurring.findUnique({ where: { id } })
    if (!existingRecurring) {
      throw new NotFoundRecurringError()
    }

    await this.dbService.recurring.delete({
      where: { id },
    })
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM, { name: 'Recurring' })
  async generate(): Promise<void> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    try {
      const activeRecurrings = await this.dbService.recurring.findMany({
        where: {
          startDate: { lte: today },
          OR: [{ endDate: null }, { endDate: { gte: today } }],
        },
      })

      if (!activeRecurrings.length) return

      const transactionsToCreate = []

      for (const recurring of activeRecurrings) {
        const daysSinceStart = differenceInDays(today, recurring.startDate)
        if (daysSinceStart >= 0 && daysSinceStart % recurring.interval === 0) {
          transactionsToCreate.push(this._createTransactionFromRecurring(recurring))
        }
      }

      if (transactionsToCreate.length > 0) {
        await Promise.allSettled(transactionsToCreate)
      }
    } catch (err) {
      console.error('Erro ao gerar transações recorrentes', err.stack)
    }
  }

  private async _createTransactionFromRecurring(recurring: Recurring) {
    return this.transactionService.create({
      name: recurring.name,
      amount: recurring.amount,
      type: recurring.type as TransactionType,
      reference: new Date(),
      recurring: true,
      walletId: recurring.walletId,
      categoryId: recurring.categoryId,
      subcategoryId: recurring.subcategoryId,
    })
  }
}
