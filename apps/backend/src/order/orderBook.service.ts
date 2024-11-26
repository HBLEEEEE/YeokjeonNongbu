import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { OrderBookDto } from './dto/orderBook.dto';
import { OrderType, TradingType } from './enums/orderType';
import { OrderRepository } from './order.repository';
import { TransactionDto } from './dto/transaction.dto';

@Injectable()
export class OrderBookService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType,
    private readonly orderRepository: OrderRepository
  ) {}

  async addOrder(order: OrderBookDto): Promise<void> {
    const orderKey = `orderBook:${order.cropId}:${order.orderType}:${order.tradingType}`;

    const score =
      order.tradingType === 'market'
        ? order.orderType === OrderType.BUY
          ? Infinity // 시장가 매수: 높은 우선순위
          : 0 // 시장가 매도: 낮은 우선순위
        : (order.price ?? 0); // 지정가 주문: 가격을 점수로 설정
    const orderData = this.serializeOrder(order);
    await this.redisClient.zAdd(orderKey, { score, value: orderData });
  }

  async updateOrder(
    cropId: number,
    orderType: OrderType,
    orderId: number,
    filledQuantity: number,
    tradingType: TradingType
  ): Promise<void> {
    const orders = await this.getOrdersFromRedis(cropId, orderType, tradingType);
    const targetOrder = orders.find(order => order.orderId === orderId);

    if (!targetOrder) {
      throw new Error(`주문번호 ${orderId}는 존재하지 않습니다.`);
    }

    if (tradingType === TradingType.LIMIT) {
      targetOrder.unfilledQuantity = Math.max(
        (targetOrder.unfilledQuantity || 0) - filledQuantity,
        0
      );
      // 미체결 수량이 0인 경우 Redis 삭제
      if (targetOrder.unfilledQuantity === 0) {
        await this.removeOrder(cropId, orderId, orderType, tradingType);
      } else {
        await this.addOrder(targetOrder);
      }
    } else if (tradingType === TradingType.MARKET) {
      if (orderType === OrderType.BUY) {
        targetOrder.totalAmount = Math.max(
          (targetOrder.totalAmount || 0) - filledQuantity * targetOrder.price!,
          0
        );
      } else if (orderType === OrderType.SELL) {
        targetOrder.quantity = Math.max((targetOrder.quantity || 0) - filledQuantity, 0);
      }
    }

    if (tradingType === TradingType.LIMIT && (targetOrder.unfilledQuantity || 0) > 0) {
      await this.addOrder(targetOrder);
    }
  }

  async removeOrder(
    cropId: number,
    orderId: number,
    orderType: OrderType,
    tradingType: TradingType
  ): Promise<void> {
    const orderKey = `orderBook:${cropId}:${orderType}:${tradingType}`;
    const orders = await this.redisClient.zRange(orderKey, 0, -1);

    const targetOrder = orders.find(order => this.deserializeOrder(order).orderId === orderId);
    if (targetOrder) {
      await this.redisClient.zRem(orderKey, targetOrder);
    }
  }

  async getTransactionsByMemberId(memberId: number): Promise<TransactionDto[]> {
    return await this.orderRepository.getTransactionsByMemberId(memberId);
  }

  async getBuyOrdersFromRedis(cropId: number): Promise<OrderBookDto[]> {
    const limitOrders = await this.getOrdersFromRedis(cropId, OrderType.BUY, TradingType.LIMIT);
    const marketOrders = await this.getOrdersFromRedis(cropId, OrderType.BUY, TradingType.MARKET);
    return [...marketOrders, ...limitOrders];
  }

  async getSellOrdersFromRedis(cropId: number): Promise<OrderBookDto[]> {
    const limitOrders = await this.getOrdersFromRedis(cropId, OrderType.SELL, TradingType.LIMIT);
    const marketOrders = await this.getOrdersFromRedis(cropId, OrderType.SELL, TradingType.MARKET);
    return [...marketOrders, ...limitOrders];
  }

  private async getOrdersFromRedis(
    cropId: number,
    orderType: OrderType,
    tradingType: TradingType
  ): Promise<OrderBookDto[]> {
    const orderKey = this.getOrderKey(cropId, orderType, tradingType);
    const orders = await this.redisClient.zRange(orderKey, 0, -1);
    return orders.map(order => this.deserializeOrder(order));
  }

  private getOrderKey(cropId: number, orderType: OrderType, tradingType: TradingType): string {
    return `orderBook:${cropId}:${orderType}:${tradingType}`;
  }

  private serializeOrder(order: OrderBookDto): string {
    const time = order.time.toISOString();
    return JSON.stringify({ ...order, time });
  }

  private deserializeOrder(orderData: string): OrderBookDto {
    const parsedOrder = JSON.parse(orderData) as OrderBookDto;
    return {
      ...parsedOrder,
      time: new Date(parsedOrder.time)
    };
  }
}
