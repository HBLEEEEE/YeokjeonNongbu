import { Injectable } from '@nestjs/common';
import { OrderBookService } from './orderBook.service';
import { OrderRepository } from './order.repository';
import { OrderDto } from './dto/order.dto';
import { LimitOrderDto } from './dto/limitOrder.dto';
import DtoTransformer from './utils/dtoTransformer';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderBookService: OrderBookService,
    private readonly orderRepository: OrderRepository
  ) {}

  async saveOrder(createOrderDto: LimitOrderDto): Promise<number> {
    const orderDto: OrderDto = DtoTransformer.toOrderDto(createOrderDto);
    const orderId = await this.orderRepository.saveOrder(orderDto);

    await this.saveOrderToOrderBook(orderDto, orderId);

    return orderId;
  }

  async saveOrderToOrderBook(order: OrderDto, orderId: number): Promise<void> {
    const orderBookDto = DtoTransformer.toOrderBookDto(order, orderId);
    await this.orderBookService.addOrder(orderBookDto);
  }
}
