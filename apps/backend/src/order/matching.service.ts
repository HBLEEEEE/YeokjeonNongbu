import { Injectable } from '@nestjs/common';
import { OrderBookService } from './orderBook.service';
import { OrderType } from './enums/orderType';

@Injectable()
export class MatchingService {
  constructor(private readonly orderBookService: OrderBookService) {}

  async matchOrders(cropId: number): Promise<void> {
    const buyOrders = await this.orderBookService.getBuyOrders(cropId);
    const sellOrders = await this.orderBookService.getSellOrders(cropId);

    let sellIndex = 0;
    let buyIndex = 0;

    while (sellIndex < sellOrders.length && buyIndex < buyOrders.length) {
      const sellOrder = sellOrders[sellIndex];
      const buyOrder = buyOrders[buyIndex];

      if (sellOrder.price > buyOrder.price) {
        break;
      }

      const matchedQuantity = Math.min(sellOrder.unfilledQuantity, buyOrder.unfilledQuantity);

      //TODO DB 트랜잭션 업데이트,체결 이벤트 발생

      await this.orderBookService.updateOrder(
        cropId,
        OrderType.BUY,
        buyOrder.orderId,
        matchedQuantity
      );
      await this.orderBookService.updateOrder(
        cropId,
        OrderType.SELL,
        sellOrder.orderId,
        matchedQuantity
      );

      if (sellOrder.unfilledQuantity <= matchedQuantity) {
        sellIndex++;
      }

      if (buyOrder.unfilledQuantity <= matchedQuantity) {
        buyIndex++;
      }
    }
  }
}
