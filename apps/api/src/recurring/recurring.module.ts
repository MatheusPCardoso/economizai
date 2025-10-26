import { Module } from '@nestjs/common'
import { RecurringService } from './recurring.service'
import { RecurringController } from './recurring.controller'
import { DatabaseModule } from '@/database/database.module'
import { ScheduleModule } from '@nestjs/schedule'
import { TransactionModule } from '@/transaction/transaction.module'

@Module({
  imports: [DatabaseModule, ScheduleModule.forRoot(), TransactionModule],
  controllers: [RecurringController],
  providers: [RecurringService],
})
export class RecurringModule {}
