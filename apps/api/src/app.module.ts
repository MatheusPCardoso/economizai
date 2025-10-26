import { Module } from '@nestjs/common'
import { WalletModule } from './wallet/wallet.module'
import { DatabaseModule } from './database/database.module'
import { CategoryModule } from './category/category.module'
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import { TransactionModule } from './transaction/transaction.module'
import { DashboardModule } from './dashboard/dashboard.module'
import { RecurringModule } from './recurring/recurring.module'

@Module({
  imports: [
    WalletModule,
    DatabaseModule,
    CategoryModule,
    AuthModule,
    ConfigModule,
    TransactionModule,
    DashboardModule,
    RecurringModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
