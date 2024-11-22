import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderBookService } from './orderBook.service';
import { OrderRepository } from './order.repository';
import { DatabaseModule } from '../database/database.module';
import { MatchingService } from './matching.service';
import { MarketModule } from '../market/market.module';
import { HasSufficientCashGuard } from '../account/guards/hasSufficientCashGuard';
import { AccountModule } from '../account/account.module';

@Module({
  providers: [
    OrderService,
    OrderBookService,
    OrderRepository,
    MatchingService,
    HasSufficientCashGuard
  ],
  controllers: [OrderController],
  imports: [DatabaseModule, MarketModule, AccountModule]
})
export class OrderModule {}
