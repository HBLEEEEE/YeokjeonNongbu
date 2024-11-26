import { Injectable } from '@nestjs/common';
import { OrderBookService } from './orderBook.service';
import { OrderRepository } from './order.repository';
import { OrderDto } from './dto/order.dto';
import DtoTransformer from './utils/dtoTransformer';
import { OrderStatus, TradingType } from './enums/orderType';
import { OrderBookDto } from './dto/orderBook.dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderBookService: OrderBookService,
    private readonly orderRepository: OrderRepository
  ) {}

  async saveOrder(orderDto: OrderDto): Promise<number[]> {
    switch (orderDto.tradingType) {
      case 'limit':
        return await this.saveLimitOrder(orderDto);
      case 'market':
        return await this.saveMarketOrder(orderDto);
      default:
        throw new Error(`Unsupported tradingType: ${orderDto.tradingType}`);
    }
  }

  private async saveLimitOrder(orderDto: OrderDto): Promise<number[]> {
    const [orderId, memberId] = await this.orderRepository.saveOrder(orderDto);
    await this.saveOrderToOrderBook(orderDto, orderId, memberId);

    return [orderId, memberId];
  }

  private async saveMarketOrder(orderDto: OrderDto): Promise<number[]> {
    const [orderId, memberId] = await this.orderRepository.saveOrder(orderDto);
    await this.saveOrderToOrderBook(orderDto, orderId, memberId);
    return [orderId, memberId];
  }

  private async saveOrderToOrderBook(
    order: OrderDto,
    orderId: number,
    memberId: number
  ): Promise<void> {
    const orderBookDto = DtoTransformer.toOrderBookDto(order, orderId, memberId);
    await this.orderBookService.addOrder(orderBookDto);
  }

  async saveTransaction(
    order: OrderBookDto,
    price: number,
    matchedQuantity: number
  ): Promise<void> {
    await this.orderRepository.saveTransaction(order, price, matchedQuantity);
  }

  // 주문 업데이트
  async updateOrder(
    orderId: number,
    status: OrderStatus,
    filledQuantity: number,
    unfilledQuantity: number | null,
    tradingType: TradingType
  ): Promise<void> {
    await this.orderRepository.updateOrder(
      orderId,
      status,
      filledQuantity,
      unfilledQuantity,
      tradingType
    );
  }

  async cancelOrder(orderId: number): Promise<void> {
    await this.orderRepository.cancelOrder(orderId);
  }
}
