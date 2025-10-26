export interface MonthAgg {
  incoming: number
  expense: number
  incomingPercent?: number
  expensePercent?: number
  balance: number
}

export interface TransactionPerMonth {
  monthKey: string
  label: string
  data: MonthAgg
}

export interface CategoryExpense {
  categoryId: string
  categoryName: string
  expense: number
  percent?: number
}

export interface DashboardResponse {
  currentMonth: MonthAgg
  lastMonth: MonthAgg
  transactionPerMonth: TransactionPerMonth[]
  expenseByCategoryTotal?: CategoryExpense[]
  expenseByCategoryCurrentMonth?: CategoryExpense[]
  expenseByCategoryMonthly?: CategoryExpense[]
  totalIncoming?: number
  totalExpense?: number
  generatedAt?: string
}
