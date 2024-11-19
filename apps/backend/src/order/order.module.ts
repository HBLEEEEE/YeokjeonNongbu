import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderBookService } from './orderBook.service';
import { OrderRepository } from './order.repository';
import { DatabaseModule } from '../database/database.module';

@Module({
  providers: [OrderService, OrderBookService, OrderRepository],
  controllers: [OrderController],
  imports: [DatabaseModule]
})
export class OrderModule {}
