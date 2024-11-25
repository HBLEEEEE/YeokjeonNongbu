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

  // saveOrder: 주문 유형에 따라 적절한 저장 메서드 호출
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

  // 지정가 주문 저장 로직
  private async saveLimitOrder(orderDto: OrderDto): Promise<number[]> {
    const [orderId, memberId] = await this.orderRepository.saveOrder(orderDto);
    await this.saveOrderToOrderBook(orderDto, orderId, memberId);

    return [orderId, memberId];
  }

  // 시장가 주문 저장 로직
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

  // 거래 저장
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
    unfilledQuantity: number,
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
}
