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
import { HasSufficientCropGuard } from '../account/guards/hasSufficientCropGuard';
import { AuthModule } from '../auth/auth.module'; // AuthModule import
import { RedisModule } from '../redis/redis.module';
import { JwtAuthGuard } from '../global/utils/jwtAuthGuard';
import { JwtService } from '@nestjs/jwt'; // RedisModule import

@Module({
  imports: [DatabaseModule, MarketModule, AccountModule, AuthModule, RedisModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderBookService,
    OrderRepository,
    MatchingService,
    HasSufficientCashGuard,
    HasSufficientCropGuard,
    JwtAuthGuard,
    JwtService
  ]
})
export class OrderModule {}
