import { PartialType } from '@nestjs/mapped-types'

export class CreateRecurringDto {
  id?: string
  name: string
  amount: number
  type: 'INCOME' | 'EXPENSE'
  interval: number
  startDate: Date
  endDate?: Date
  walletId: string
  categoryId: string
  subcategoryId?: string
  generateFirst?: boolean
}

export class UpdateRecurringDto extends PartialType(CreateRecurringDto) {}
