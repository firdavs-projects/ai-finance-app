import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { TransactionsModule } from '../transactions/transactions.module';
import { CategoriesModule } from '../categories/categories.module';
import { AccountsModule } from '../accounts/accounts.module';

@Module({
  imports: [TransactionsModule, CategoriesModule, AccountsModule],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
