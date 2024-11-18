import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderBookService } from './orderBook.service';
import { OrderDto } from './dto/order.dto';
import { OrderBookDto } from './dto/orderBook.dto';

@Controller('api/order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly orderBookService: OrderBookService
  ) {}

  @Post('buy')
  async createBuyOrder(@Body() orderDto: OrderDto): Promise<string> {
    // TODO: 주문 데이터를 데이터베이스에 저장
    await this.orderService.placeOrder(orderDto);
    return '구매 주문이 성공적으로 생성되었습니다.';
  }

  @Post('sell')
  async createSellOrder(@Body() orderDto: OrderDto): Promise<string> {
    // TODO: 주문 데이터를 데이터베이스에 저장
    await this.orderService.placeOrder(orderDto);
    return '판매 주문이 성공적으로 생성되었습니다.';
  }

  @Get('buy/:cropId')
  async getBuyOrders(@Param('cropId') cropId: number): Promise<OrderBookDto[]> {
    // TODO: 필요 시 데이터베이스에서 데이터를 가져옴
    return await this.orderBookService.getBuyOrders(cropId);
  }

  @Get('sell/:cropId')
  async getSellOrders(@Param('cropId') cropId: number): Promise<OrderBookDto[]> {
    // TODO: 필요 시 데이터베이스에서 데이터를 가져옴
    return await this.orderBookService.getSellOrders(cropId);
  }

  @Post('cancel')
  async cancelOrder(
    @Body()
    { cropId, orderId, orderType }: { cropId: number; orderId: number; orderType: 'buy' | 'sell' }
  ): Promise<string> {
    // TODO: 데이터베이스에서 주문 상태를 "취소됨"으로 업데이트
    await this.orderBookService.removeOrder(cropId, orderId, orderType);
    return '주문이 성공적으로 취소되었습니다.';
  }
}
