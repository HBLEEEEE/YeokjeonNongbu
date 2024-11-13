import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { OrderBookDto } from './dto/orderBook.dto';

@Injectable()
export class OrderBookService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType) {}

  async addOrder(order: OrderBookDto): Promise<void> {
    const orderKey = `orderBook:${order.cropId}:${order.orderType}`;
    const orderData = this.serializeOrder(order);
    await this.redisClient.zAdd(orderKey, { score: order.price, value: orderData });
  }

  async getBuyOrders(cropId: number): Promise<OrderBookDto[]> {
    const orderKey = `orderBook:${cropId}:buy`;
    const orders = await this.redisClient.zRange(orderKey, 0, -1, { REV: true });
    return orders.map((order: string) => this.deserializeOrder(order));
  }

  async getSellOrders(cropId: number): Promise<OrderBookDto[]> {
    const orderKey = `orderBook:${cropId}:sell`;
    const orders = await this.redisClient.zRange(orderKey, 0, -1);
    return orders.map((order: string) => this.deserializeOrder(order));
  }

  async removeOrder(cropId: number, orderId: string, orderType: 'buy' | 'sell'): Promise<void> {
    const orderKey = `orderBook:${cropId}:${orderType}`;
    const orders = await this.redisClient.zRange(orderKey, 0, -1);

    const orderToRemove = orders.find(order => this.deserializeOrder(order).orderId === orderId);
    if (orderToRemove) {
      await this.redisClient.zRem(orderKey, orderToRemove);
    }
  }

  async updateOrder(
    cropId: string,
    orderType: 'buy' | 'sell',
    orderId: string,
    filledQuantity: number
  ): Promise<void> {
    const orderKey = `orderBook:${cropId}:${orderType}`;
    const orders = await this.redisClient.zRange(orderKey, 0, -1);

    const updatedOrders = orders.map((order: string) => {
      const parsedOrder = JSON.parse(order) as OrderBookDto;
      if (parsedOrder.orderId === orderId) {
        parsedOrder.unfilledQuantity -= filledQuantity; // 남은 수량 감소
      }
      return this.serializeOrder(parsedOrder);
    });

    await this.redisClient.del(orderKey);
    for (const updatedOrder of updatedOrders) {
      const parsedOrder = this.deserializeOrder(updatedOrder);
      await this.redisClient.zAdd(orderKey, { score: parsedOrder.price, value: updatedOrder });
    }
  }

  private serializeOrder(order: OrderBookDto): string {
    return JSON.stringify(order);
  }

  private deserializeOrder(orderData: string): OrderBookDto {
    return JSON.parse(orderData) as OrderBookDto;
  }
}
