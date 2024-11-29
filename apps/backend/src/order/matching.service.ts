import { OrderStatus, OrderType, TradingType } from './enums/orderType';
import { OrderBookService } from './orderBook.service';
import { OrderService } from './order.service';
import { MarketService } from '../market/market.service';
import { AccountService } from '../account/account.service';
import { OrderBookDto } from './dto/orderBook.dto';
import { Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';

@Injectable()
export class MatchingService {
  constructor(
    private readonly orderBookService: OrderBookService,
    private readonly orderService: OrderService,
    private readonly marketService: MarketService,
    private readonly accountService: AccountService,
    private readonly mailService: MailService
  ) {}

  async matchOrders(cropId: number): Promise<void> {
    const buyOrders = await this.orderBookService.getBuyOrdersFromRedis(cropId);
    const sellOrders = await this.orderBookService.getSellOrdersFromRedis(cropId);

    let sellIndex = 0;
    let buyIndex = 0;

    while (sellIndex < sellOrders.length && buyIndex < buyOrders.length) {
      const sellOrder = sellOrders[sellIndex];
      const buyOrder = buyOrders[buyIndex];

      // 시장가 매수 처리
      if (buyOrder.tradingType === TradingType.MARKET) {
        if (!sellOrder) {
          buyIndex++; // 매칭 가능한 매도 주문 없음
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
        await this.marketService.setCropPrice({ cropId: cropId, price: sellOrder.price! }); // 가격 업데이트

        if (sellOrder.unfilledQuantity! <= 0) sellIndex++;
        if (buyOrder.totalAmount! <= 0 || availableQuantity === 0) {
          buyIndex++;
        }
        continue;
      }

      // 시장가 매도 처리
      if (sellOrder.tradingType === TradingType.MARKET) {
        if (!buyOrder) {
          sellIndex++; // 매칭 가능한 매수 주문 없음
          continue;
        }

        const availableQuantity = Math.min(buyOrder.unfilledQuantity!, sellOrder.quantity!);

        sellOrder.filledQuantity += availableQuantity;
        sellOrder.quantity! -= availableQuantity;
        buyOrder.unfilledQuantity! -= availableQuantity;

        await this.processOrderMatch(buyOrder, sellOrder, availableQuantity);
        await this.marketService.setCropPrice({ cropId: cropId, price: buyOrder.price! }); // 가격 업데이트

        if (buyOrder.unfilledQuantity! <= 0) buyIndex++;
        if (sellOrder.quantity! <= 0 || availableQuantity === 0) {
          sellIndex++;
        }
        continue;
      }

      if (sellOrder.price! > buyOrder.price!) {
        buyIndex++; // 매도 주문 중 더 낮은 가격이 있는지 확인
        continue;
      }
      const matchedQuantity = Math.min(sellOrder.unfilledQuantity!, buyOrder.unfilledQuantity!);

      sellOrder.unfilledQuantity! -= matchedQuantity;
      buyOrder.unfilledQuantity! -= matchedQuantity;
      sellOrder.filledQuantity += matchedQuantity;
      buyOrder.filledQuantity += matchedQuantity;

      await this.processOrderMatch(buyOrder, sellOrder, matchedQuantity);
      await this.marketService.setCropPrice({ cropId: cropId, price: sellOrder.price! }); // 가격 업데이트

      if (sellOrder.unfilledQuantity! <= 0) sellIndex++;
      if (buyOrder.unfilledQuantity! <= 0) buyIndex++;
    }

    // 시장가 주문은 매칭 완료 후 삭제
    await this.cleanMarketOrders(cropId, buyOrders, sellOrders);
  }

  private async cleanMarketOrders(
    cropId: number,
    remainingBuyOrders: OrderBookDto[],
    remainingSellOrders: OrderBookDto[]
  ): Promise<void> {
    // 시장가 매수 주문 정리
    for (const buyOrder of remainingBuyOrders) {
      if (buyOrder.tradingType === TradingType.MARKET) {
        // 매칭되지 않은 금액 롤백
        if (buyOrder.totalAmount! > 0) {
          await this.handlePendingRollback(
            cropId,
            buyOrder.memberId,
            buyOrder.totalAmount!,
            OrderType.BUY
          );
        }

        // 주문 상태 완료 처리
        await this.orderService.updateOrder(
          buyOrder.orderId,
          OrderStatus.COMPLETED,
          buyOrder.filledQuantity,
          buyOrder.unfilledQuantity!,
          buyOrder.tradingType
        );

        // Redis 주문 제거
        await this.orderBookService.removeOrder(
          buyOrder.memberId,
          cropId,
          buyOrder.orderId,
          OrderType.BUY,
          TradingType.MARKET
        );
      }
    }

    // 시장가 매도 주문 정리
    for (const sellOrder of remainingSellOrders) {
      if (sellOrder.tradingType === TradingType.MARKET) {
        // 매칭되지 않은 수량 롤백
        if (sellOrder.quantity! > 0) {
          await this.handlePendingRollback(
            cropId,
            sellOrder.memberId,
            sellOrder.quantity!,
            OrderType.SELL
          );
        }

        // 주문 상태 완료 처리
        await this.orderService.updateOrder(
          sellOrder.orderId,
          OrderStatus.COMPLETED,
          sellOrder.filledQuantity,
          sellOrder.unfilledQuantity!,
          sellOrder.tradingType
        );

        // Redis 주문 제거
        await this.orderBookService.removeOrder(
          sellOrder.memberId,
          cropId,
          sellOrder.orderId,
          OrderType.SELL,
          TradingType.MARKET
        );
      }
    }
  }

  private async processOrderMatch(
    buyOrder: OrderBookDto,
    sellOrder: OrderBookDto,
    matchedQuantity: number
  ): Promise<void> {
    const matchedPrice = this.determineMatchPrice(buyOrder, sellOrder);

    // 주문 오더 상태 업데이트
    await this.orderService.updateOrder(
      sellOrder.orderId,
      sellOrder.unfilledQuantity! > 0 || sellOrder.filledQuantity != sellOrder.quantity
        ? OrderStatus.PARTIALLY_FILLED
        : OrderStatus.COMPLETED,
      sellOrder.filledQuantity,
      sellOrder.unfilledQuantity!,
      sellOrder.tradingType
    );

    await this.orderService.updateOrder(
      buyOrder.orderId,
      buyOrder.unfilledQuantity! > 0 ||
        (buyOrder.totalAmount! > 0 && buyOrder.tradingType === TradingType.MARKET)
        ? OrderStatus.PARTIALLY_FILLED
        : OrderStatus.COMPLETED,
      buyOrder.filledQuantity,
      buyOrder.unfilledQuantity!,
      buyOrder.tradingType
    );

    // 트랜잭션 저장
    await this.orderService.saveTransaction(sellOrder, matchedPrice, matchedQuantity);
    await this.orderService.saveTransaction(buyOrder, matchedPrice, matchedQuantity);

    // 캐시 및 작물 데이터 업데이트
    await this.accountService.updateCashByCompletingOrder(
      sellOrder.memberId,
      matchedPrice * matchedQuantity,
      OrderType.SELL
    );
    await this.accountService.updateCashByCompletingOrder(
      buyOrder.memberId,
      buyOrder.tradingType != TradingType.MARKET && buyOrder.price != matchedPrice
        ? buyOrder.price! * matchedQuantity
        : matchedPrice * matchedQuantity,
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

    // 체결 이벤트 알림 전달

    // 매수자 알림 생성
    await this.mailService.createMailByOtherService(
      buyOrder.memberId,
      1,
      buyOrder.cropId,
      matchedPrice,
      matchedQuantity,
      null
    );

    // 매도자 알림 생성
    await this.mailService.createMailByOtherService(
      sellOrder.memberId,
      2,
      sellOrder.cropId,
      matchedPrice,
      matchedQuantity,
      null
    );

    // 지정가 거래만 오더북 업데이트
    if (sellOrder.unfilledQuantity! > 0 && sellOrder.tradingType === TradingType.LIMIT) {
      await this.orderBookService.updateOrder(
        sellOrder.memberId,
        sellOrder.cropId,
        OrderType.SELL,
        sellOrder.orderId,
        matchedQuantity,
        sellOrder.tradingType
      );
    }
    if (buyOrder.unfilledQuantity! > 0 && buyOrder.tradingType === TradingType.LIMIT) {
      await this.orderBookService.updateOrder(
        buyOrder.memberId,
        buyOrder.cropId,
        OrderType.BUY,
        buyOrder.orderId,
        matchedQuantity,
        buyOrder.tradingType
      );
    }

    if (buyOrder.tradingType == 'limit' && buyOrder.unfilledQuantity! === 0) {
      await this.orderBookService.removeOrder(
        buyOrder.memberId,
        buyOrder.cropId,
        buyOrder.orderId,
        OrderType.BUY,
        buyOrder.tradingType
      );
    }

    if (buyOrder.tradingType == 'limit' && sellOrder.unfilledQuantity! === 0) {
      await this.orderBookService.removeOrder(
        sellOrder.memberId,
        sellOrder.cropId,
        sellOrder.orderId,
        OrderType.SELL,
        sellOrder.tradingType
      );
    }
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
    const currentOrder = buyOrder.time > sellOrder.time ? buyOrder : sellOrder;

    if (sellOrder.tradingType === TradingType.MARKET && buyOrder.price) return buyOrder.price;
    if (buyOrder.tradingType === TradingType.MARKET && sellOrder.price) return sellOrder.price;
    if (buyOrder.price! >= sellOrder.price!) {
      return currentOrder.orderType === OrderType.BUY ? sellOrder.price! : buyOrder.price!;
    }
    throw new Error('체결 가격을 결정할 수 없습니다.');
  }
}
