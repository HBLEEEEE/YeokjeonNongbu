import { OrderStatus, OrderType, TradingType } from './enums/orderType';
import { OrderBookService } from './orderBook.service';
import { OrderService } from './order.service';
import { MarketService } from '../market/market.service';
import { AccountService } from '../account/account.service';
import { OrderBookDto } from './dto/orderBook.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MatchingService {
  constructor(
    private readonly orderBookService: OrderBookService,
    private readonly orderService: OrderService,
    private readonly marketService: MarketService,
    private readonly accountService: AccountService
  ) {}

  async matchOrders(cropId: number): Promise<void> {
    const buyOrders = await this.orderBookService.getBuyOrdersFromRedis(cropId);
    const sellOrders = await this.orderBookService.getSellOrdersFromRedis(cropId);

    let sellIndex = 0;
    let buyIndex = 0;

    while (sellIndex < sellOrders.length && buyIndex < buyOrders.length) {
      const sellOrder = sellOrders[sellIndex];
      const buyOrder = buyOrders[buyIndex];

      // 1. 시장가 매수 처리
      if (buyOrder.tradingType === TradingType.MARKET) {
        if (!sellOrder) {
          // 매수 불가: 롤백 및 삭제 처리
          await this.handlePendingRollback(
            cropId,
            buyOrder.memberId,
            buyOrder.totalAmount!, // totalAmount 기반
            OrderType.BUY
          );
          await this.orderBookService.removeOrder(
            cropId,
            buyOrder.orderId,
            OrderType.BUY,
            TradingType.MARKET
          );
          buyIndex++;
          continue;
        }

        const availableQuantity = Math.min(
          sellOrder.unfilledQuantity!,
          Math.floor(buyOrder.totalAmount! / sellOrder.price!)
        );
        const matchedAmount = availableQuantity * sellOrder.price!;

        buyOrder.filledQuantity += availableQuantity;
        buyOrder.totalAmount! -= matchedAmount;
        sellOrder.unfilledQuantity! -= availableQuantity;

        await this.processOrderMatch(buyOrder, sellOrder, availableQuantity);

        if (sellOrder.unfilledQuantity! <= 0) sellIndex++;
        if (buyOrder.totalAmount! <= 0 || availableQuantity === 0) {
          await this.orderBookService.removeOrder(
            cropId,
            buyOrder.orderId,
            OrderType.BUY,
            TradingType.MARKET
          );
          buyIndex++;
        }
        continue;
      }

      // 2. 시장가 매도 처리
      if (sellOrder.tradingType === TradingType.MARKET) {
        if (!buyOrder) {
          // 매도 불가: 롤백 및 삭제 처리
          await this.handlePendingRollback(
            cropId,
            sellOrder.memberId,
            sellOrder.quantity!, // quantity 기반
            OrderType.SELL
          );
          await this.orderBookService.removeOrder(
            cropId,
            sellOrder.orderId,
            OrderType.SELL,
            TradingType.MARKET
          );
          sellIndex++;
          continue;
        }

        const availableQuantity = Math.min(buyOrder.unfilledQuantity!, sellOrder.quantity!);

        sellOrder.filledQuantity += availableQuantity;
        sellOrder.quantity! -= availableQuantity;
        buyOrder.unfilledQuantity! -= availableQuantity;

        await this.processOrderMatch(buyOrder, sellOrder, availableQuantity);

        if (buyOrder.unfilledQuantity! <= 0) buyIndex++;
        if (sellOrder.quantity! <= 0 || availableQuantity === 0) {
          await this.orderBookService.removeOrder(
            cropId,
            sellOrder.orderId,
            OrderType.SELL,
            TradingType.MARKET
          );
          sellIndex++;
        }
        continue;
      }

      // 3. 지정가 매칭
      if (sellOrder.price! > buyOrder.price!) {
        break; // 더 이상 매칭 불가
      }

      const matchedQuantity = Math.min(sellOrder.unfilledQuantity!, buyOrder.unfilledQuantity!);

      sellOrder.unfilledQuantity! -= matchedQuantity;
      buyOrder.unfilledQuantity! -= matchedQuantity;
      sellOrder.filledQuantity += matchedQuantity;
      buyOrder.filledQuantity += matchedQuantity;

      await this.processOrderMatch(buyOrder, sellOrder, matchedQuantity);

      if (sellOrder.unfilledQuantity! <= 0) sellIndex++;
      if (buyOrder.unfilledQuantity! <= 0) buyIndex++;
    }

    // 잔여 시장가 주문 처리 및 롤백
    while (buyIndex < buyOrders.length && buyOrders[buyIndex].tradingType === TradingType.MARKET) {
      const buyOrder = buyOrders[buyIndex];
      await this.handlePendingRollback(
        cropId,
        buyOrder.memberId,
        buyOrder.totalAmount!, // 남은 totalAmount 롤백
        OrderType.BUY
      );
      await this.orderBookService.removeOrder(
        cropId,
        buyOrder.orderId,
        OrderType.BUY,
        TradingType.MARKET
      );
      buyIndex++;
    }

    while (
      sellIndex < sellOrders.length &&
      sellOrders[sellIndex].tradingType === TradingType.MARKET
    ) {
      const sellOrder = sellOrders[sellIndex];
      await this.handlePendingRollback(
        cropId,
        sellOrder.memberId,
        sellOrder.quantity!, // 남은 quantity 롤백
        OrderType.SELL
      );
      await this.orderBookService.removeOrder(
        cropId,
        sellOrder.orderId,
        OrderType.SELL,
        TradingType.MARKET
      );
      sellIndex++;
    }
  }

  private async processOrderMatch(
    buyOrder: OrderBookDto,
    sellOrder: OrderBookDto,
    matchedQuantity: number
  ): Promise<void> {
    const price = this.determineMatchPrice(buyOrder, sellOrder);

    await this.orderService.updateOrder(
      sellOrder.orderId,
      sellOrder.unfilledQuantity! > 0 ? OrderStatus.PARTIALLY_FILLED : OrderStatus.COMPLETED,
      sellOrder.filledQuantity,
      sellOrder.unfilledQuantity!,
      sellOrder.tradingType
    );

    await this.orderService.updateOrder(
      buyOrder.orderId,
      buyOrder.unfilledQuantity! > 0 ? OrderStatus.PARTIALLY_FILLED : OrderStatus.COMPLETED,
      buyOrder.filledQuantity,
      buyOrder.unfilledQuantity!,
      buyOrder.tradingType
    );

    await this.orderService.saveTransaction(sellOrder, price, matchedQuantity);
    await this.orderService.saveTransaction(buyOrder, price, matchedQuantity);

    await this.accountService.updateCashByCompletingOrder(
      sellOrder.memberId,
      price * matchedQuantity,
      OrderType.SELL
    );
    await this.accountService.updateCashByCompletingOrder(
      buyOrder.memberId,
      price * matchedQuantity,
      OrderType.BUY
    );
    await this.accountService.updateCropByCompletingSellOrder(
      sellOrder.memberId,
      sellOrder.cropId,
      matchedQuantity
    );
    await this.accountService.updateCropByCompletingBuyOrder(
      buyOrder.memberId,
      buyOrder.cropId,
      matchedQuantity
    );

    await this.orderBookService.updateOrder(
      sellOrder.cropId,
      OrderType.SELL,
      sellOrder.orderId,
      matchedQuantity,
      sellOrder.tradingType
    );
    await this.orderBookService.updateOrder(
      buyOrder.cropId,
      OrderType.BUY,
      buyOrder.orderId,
      matchedQuantity,
      buyOrder.tradingType
    );

    const cropPrice = { crop: sellOrder.cropId, price };
    await this.marketService.setCropPrice(cropPrice);
  }

  private async handlePendingRollback(
    cropId: number,
    memberId: number,
    amountOrQuantity: number,
    orderType: OrderType
  ): Promise<void> {
    if (amountOrQuantity > 0) {
      if (orderType === OrderType.BUY) {
        await this.accountService.rollbackPendingCash(memberId, amountOrQuantity);
      } else if (orderType === OrderType.SELL) {
        await this.accountService.rollbackPendingCrop(cropId, memberId, amountOrQuantity);
      }
    }
  }

  private determineMatchPrice(buyOrder: OrderBookDto, sellOrder: OrderBookDto): number {
    if (sellOrder.tradingType === TradingType.MARKET && sellOrder.price) return sellOrder.price;
    if (buyOrder.tradingType === TradingType.MARKET && buyOrder.price) return buyOrder.price;
    if (sellOrder.price) return sellOrder.price;
    if (buyOrder.price) return buyOrder.price;
    throw new Error('체결 가격을 결정할 수 없습니다.');
  }
}
