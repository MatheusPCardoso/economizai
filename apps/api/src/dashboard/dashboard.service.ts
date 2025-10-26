import { DatabaseService } from '@/database/database.service'
import { Injectable, BadRequestException } from '@nestjs/common'
import { TransactionType } from '@prisma/client'
import { subMonths, startOfMonth, endOfMonth } from 'date-fns'
import { DashboardResponse } from './dashboard.response'

interface MonthlyAggregationResult {
  _id: { year: number; month: number; type: TransactionType }
  total: number
}

interface CategoryAggregationResult {
  _id: { categoryId: string; categoryName: string }
  total: number
}

interface CategoryByMonthAggregationResult {
  _id: { year: number; month: number; categoryId: string; categoryName: string }
  total: number
}

@Injectable()
export class DashboardService {
  constructor(private readonly dbService: DatabaseService) {}

  async getDashboardData(walletId: string): Promise<DashboardResponse> {
    if (!walletId) {
      throw new BadRequestException('walletId é obrigatório')
    }

    const { now, thisMonthStart, thisMonthEnd, prevMonthStart, prevMonthEnd, rangeStart } =
      this.getDateRanges()

    const [
      monthlyAggregations,
      totalCategoryExpenses,
      currentMonthCategoryExpenses,
      categoryExpensesByMonth,
      lastMonthTotals,
      currentMonthTotals,
    ] = await Promise.all([
      this.getMonthlyAggregations(walletId, rangeStart, thisMonthEnd),
      this.getCategoryExpenses(walletId, rangeStart, thisMonthEnd),
      this.getCategoryExpenses(walletId, thisMonthStart, thisMonthEnd),
      this.getCategoryExpensesByMonth(walletId, rangeStart, thisMonthEnd),
      this.getPeriodTotals(walletId, prevMonthStart, prevMonthEnd),
      this.getPeriodTotals(walletId, thisMonthStart, thisMonthEnd),
    ])

    const transactionPerMonth = this.processMonthlyAggregations(now, monthlyAggregations)
    const expenseByCategoryMonthly = this.processCategoryExpensesByMonth(
      now,
      categoryExpensesByMonth
    )

    return {
      currentMonth: {
        incoming: this.centsToReal(currentMonthTotals.incoming),
        expense: this.centsToReal(currentMonthTotals.expense),
        incomingPercent: this.calculatePercentChange(
          currentMonthTotals.incoming,
          lastMonthTotals.incoming
        ),
        expensePercent: this.calculatePercentChange(
          currentMonthTotals.expense,
          lastMonthTotals.expense
        ),
        balance: this.centsToReal(currentMonthTotals.incoming - currentMonthTotals.expense),
      },
      lastMonth: {
        incoming: this.centsToReal(lastMonthTotals.incoming),
        expense: this.centsToReal(lastMonthTotals.expense),
        balance: this.centsToReal(lastMonthTotals.incoming - lastMonthTotals.expense),
      },
      transactionPerMonth,
      expenseByCategoryTotal: this.formatCategoryExpenses(totalCategoryExpenses),
      expenseByCategoryCurrentMonth: this.formatCategoryExpenses(currentMonthCategoryExpenses),
      totalIncoming: transactionPerMonth.reduce((sum, month) => sum + month.data.incoming, 0),
      totalExpense: transactionPerMonth.reduce((sum, month) => sum + month.data.expense, 0),
      expenseByCategoryMonthly,
      generatedAt: new Date().toISOString(),
    }
  }

  private calculatePercentChange(current: number, previous: number): number {
    if (previous === 0) {
      return 0
    }
    return Math.round(((current - previous) / previous) * 100)
  }

  private getDateRanges() {
    const now = new Date()
    return {
      now,
      thisMonthStart: startOfMonth(now),
      thisMonthEnd: endOfMonth(now),
      prevMonthStart: startOfMonth(subMonths(now, 1)),
      prevMonthEnd: endOfMonth(subMonths(now, 1)),
      rangeStart: startOfMonth(subMonths(now, 11)),
    }
  }

  private async getMonthlyAggregations(
    walletId: string,
    gte: Date,
    lte: Date
  ): Promise<MonthlyAggregationResult[]> {
    return this.dbService.transaction.aggregateRaw({
      pipeline: [
        {
          $match: {
            walletId: { $oid: walletId },
            reference: { $gte: { $date: gte.toISOString() }, $lte: { $date: lte.toISOString() } },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$reference' },
              month: { $month: '$reference' },
              type: '$type',
            },
            total: { $sum: '$amount' },
          },
        },
      ],
    }) as any
  }

  private async getPeriodTotals(walletId: string, gte: Date, lte: Date) {
    const result: { _id: TransactionType; total: number }[] =
      (await this.dbService.transaction.aggregateRaw({
        pipeline: [
          {
            $match: {
              walletId: { $oid: walletId },
              reference: { $gte: { $date: gte.toISOString() }, $lte: { $date: lte.toISOString() } },
            },
          },
          { $group: { _id: '$type', total: { $sum: '$amount' } } },
        ],
      })) as any

    const incoming = result.find((r) => r._id === 'INCOME')?.total ?? 0
    const expense = result.find((r) => r._id === 'EXPENSE')?.total ?? 0
    return { incoming, expense }
  }

  private async getCategoryExpenses(
    walletId: string,
    gte: Date,
    lte: Date
  ): Promise<CategoryAggregationResult[]> {
    const t = (await this.dbService.transaction.aggregateRaw({
      pipeline: [
        {
          $match: {
            walletId: { $oid: walletId },
            type: 'EXPENSE',
            reference: { $gte: { $date: gte.toISOString() }, $lte: { $date: lte.toISOString() } },
          },
        },
        {
          $lookup: {
            from: 'Category',
            localField: 'categoryId',
            foreignField: '_id',
            as: 'categoryInfo',
          },
        },
        { $unwind: '$categoryInfo' },
        {
          $group: {
            _id: {
              categoryId: { $toString: '$categoryId' },
              categoryName: '$categoryInfo.name',
            },
            total: { $sum: '$amount' },
          },
        },
        { $sort: { total: -1 } },
      ],
    })) as any
    return t
  }

  private async getCategoryExpensesByMonth(
    walletId: string,
    gte: Date,
    lte: Date
  ): Promise<CategoryByMonthAggregationResult[]> {
    const res = (await this.dbService.transaction.aggregateRaw({
      pipeline: [
        {
          $match: {
            walletId: { $oid: walletId },
            type: 'EXPENSE',
            reference: { $gte: { $date: gte.toISOString() }, $lte: { $date: lte.toISOString() } },
          },
        },
        {
          $lookup: {
            from: 'Category',
            localField: 'categoryId',
            foreignField: '_id',
            as: 'categoryInfo',
          },
        },
        { $unwind: '$categoryInfo' },
        {
          $group: {
            _id: {
              year: { $year: '$reference' },
              month: { $month: '$reference' },
              categoryId: { $toString: '$categoryId' },
              categoryName: '$categoryInfo.name',
            },
            total: { $sum: '$amount' },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1, total: -1 } },
      ],
    })) as any

    return res
  }

  private processMonthlyAggregations(now: Date, aggregations: MonthlyAggregationResult[]) {
    const monthlyData: Record<string, { incoming: number; expense: number }> = {}

    for (let i = 11; i >= 0; i--) {
      const d = subMonths(now, i)
      const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`
      monthlyData[key] = { incoming: 0, expense: 0 }
    }

    for (const agg of aggregations) {
      const { year, month, type } = agg._id
      const key = `${year}-${month.toString().padStart(2, '0')}`
      if (monthlyData[key]) {
        if (type === TransactionType.INCOME) {
          monthlyData[key].incoming = agg.total
        } else if (type === TransactionType.EXPENSE) {
          monthlyData[key].expense = agg.total
        }
      }
    }

    return Object.entries(monthlyData).map(([monthKey, data]) => {
      const [year, month] = monthKey.split('-').map(Number)
      const date = new Date(year, month - 1)

      return {
        monthKey,
        label: date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' }),
        data: {
          incoming: this.centsToReal(data.incoming),
          expense: this.centsToReal(data.expense),
          balance: this.centsToReal(data.incoming - data.expense),
        },
      }
    })
  }

  private processCategoryExpensesByMonth(
    now: Date,
    aggregations: CategoryByMonthAggregationResult[]
  ) {
    const months: string[] = []
    for (let i = 11; i >= 0; i--) {
      const d = subMonths(now, i)
      months.push(`${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`)
    }

    const map: Record<
      string,
      {
        categories: {
          categoryId: string
          categoryName: string
          expenseCents: number
          expense: number
        }[]
      }
    > = {}
    for (const m of months) {
      map[m] = { categories: [] }
    }

    for (const agg of aggregations) {
      const { year, month, categoryId, categoryName } = agg._id
      const key = `${year}-${month.toString().padStart(2, '0')}`
      if (!map[key]) continue
      map[key].categories.push({
        categoryId,
        categoryName: categoryName ?? 'Sem Categoria',
        expenseCents: agg.total,
        expense: this.centsToReal(agg.total),
      })
    }

    return Object.entries(map).map(([monthKey, data]) => {
      const totalCents = data.categories.reduce((s, c) => s + c.expenseCents, 0)
      const categories = data.categories
        .sort((a, b) => b.expenseCents - a.expenseCents)
        .map((c) => ({
          categoryId: c.categoryId,
          categoryName: c.categoryName,
          expenseCents: c.expenseCents,
          expense: c.expense,
          percent:
            totalCents > 0 ? parseFloat(((c.expenseCents / totalCents) * 100).toFixed(2)) : 0,
        }))

      const [year, month] = monthKey.split('-').map(Number)
      const date = new Date(year, month - 1)

      return {
        categoryId: data.categories[0]?.categoryId,
        categoryName: data.categories[0]?.categoryName,
        expense: data.categories[0]?.expense,
        monthKey,
        label: date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' }),
        totalExpense: this.centsToReal(totalCents),
        categories,
      }
    })
  }

  private formatCategoryExpenses(aggregations: CategoryAggregationResult[]) {
    const totalExpense = aggregations.reduce((sum, agg) => sum + agg.total, 0)

    return aggregations.map((agg) => ({
      categoryId: agg._id.categoryId.toString(),
      categoryName: agg._id.categoryName ?? 'Sem Categoria',
      expense: parseFloat((agg.total / 100).toFixed(2)),
      percent: totalExpense > 0 ? parseFloat(((agg.total / totalExpense) * 100).toFixed(2)) : 0,
    }))
  }

  private centsToReal(cents: number): number {
    return parseFloat((cents / 100).toFixed(2))
  }
}
