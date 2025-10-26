import { TransactionType } from '@prisma/client'
import { Type } from 'class-transformer'
import {
  IsBoolean,
  IsDate,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class CreateTransactionDto {
  @IsOptional()
  @IsString()
  id?: string

  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsNumber()
  amount: number

  @IsNotEmpty()
  @IsIn([TransactionType.INCOME, TransactionType.EXPENSE])
  type: TransactionType

  @IsOptional()
  @IsString()
  @IsBoolean()
  recurring?: boolean

  @IsString()
  @IsNotEmpty()
  categoryId: string

  @IsString()
  @IsOptional()
  subcategoryId?: string

  @IsString()
  @IsNotEmpty()
  walletId: string

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  reference: Date
}

export class UpdateTransactionDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsNumber()
  amount?: number

  @IsIn([TransactionType.INCOME, TransactionType.EXPENSE])
  @IsOptional()
  type?: TransactionType

  @IsOptional()
  @IsBoolean()
  recurring?: boolean

  @IsOptional()
  @IsString()
  categoryId?: string

  @IsOptional()
  @IsString()
  subcategoryId?: string

  @IsOptional()
  @IsString()
  reference?: string
}
