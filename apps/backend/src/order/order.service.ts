import { Injectable } from '@nestjs/common';
import { OrderBookService } from './orderBook.service';
import { OrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly orderBookService: OrderBookService) {}

  async placeOrder(order: OrderDto): Promise<void> {
    const orderBookDto = {
      orderId: order.orderId,
      cropId: order.cropId,
      orderType: order.orderType,
      price: order.price,
      unfilledQuantity: order.quantity,
      timestamp: Date.now()
    };
    await this.orderBookService.addOrder(orderBookDto);
  }
}
