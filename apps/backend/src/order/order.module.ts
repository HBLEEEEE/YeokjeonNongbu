import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderBookService } from './orderBook.service';

@Module({
  providers: [OrderService, OrderBookService],
  controllers: [OrderController]
})
export class OrderModule {}
