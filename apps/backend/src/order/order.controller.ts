import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderBookService } from './orderBook.service';
import DtoTransformer from './utils/dtoTransformer';
import { LimitOrderDto } from './dto/limitOrder.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MatchingService } from './matching.service';
import { successhandler, successMessage } from '../global/successhandler';
import { orderResponseDecorator } from './decorator/order.decorator';
import { transactionResponseDecorator } from './decorator/getTransactions.decorator';
import { HasSufficientCashGuard } from '../account/guards/hasSufficientCashGuard';

@Controller('api/order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly orderBookService: OrderBookService,
    private readonly machineService: MatchingService
  ) {}

  @Post('buy/limit')
  @UseGuards(HasSufficientCashGuard)
  @ApiOperation({ summary: '구매 주문 생성' })
  @orderResponseDecorator()
  async createBuyOrder(@Body() limitOrderDto: LimitOrderDto) {
    const orderDto = DtoTransformer.toOrderDto(limitOrderDto);
    await this.orderService.saveOrder(orderDto);
    await this.machineService.matchOrders(limitOrderDto.cropId);
    return successhandler(successMessage.CREATE_ORDER_SUCCESS);
  }

  @Post('sell/limit')
  @UseGuards(HasSufficientCashGuard)
  @ApiOperation({ summary: '판매 주문 생성' })
  @orderResponseDecorator()
  async createSellOrder(@Body() limitOrderDto: LimitOrderDto) {
    const orderDto = DtoTransformer.toOrderDto(limitOrderDto);
    await this.orderService.saveOrder(orderDto);
    await this.machineService.matchOrders(limitOrderDto.cropId);
    return successhandler(successMessage.CREATE_ORDER_SUCCESS);
  }

  @Get('')
  @ApiOperation({ summary: '각 회원 체결 내역 조회' })
  @transactionResponseDecorator()
  async getTransactionsByMemberId(@Query('memberId') memberId: number) {
    const transactions = await this.orderBookService.getTransactionsByMemberId(memberId);
    return successhandler(successMessage.GET_TRANSACTION_SUCCESS, transactions);
  }

  @Post('cancel')
  @ApiOperation({ summary: '주문 취소' })
  @ApiResponse({ status: 200, description: '주문 취소 성공' })
  async cancelOrder(
    @Body()
    { cropId, orderId, orderType }: { cropId: number; orderId: number; orderType: 'buy' | 'sell' }
  ) {
    await this.orderBookService.removeOrder(cropId, orderId, orderType);
    return successhandler(successMessage.DELETE_ORDER_SUCCESS);
  }
}
