import { ApiProperty } from '@nestjs/swagger';
import { OrderType } from '../enums/orderType';

export class OrderBookDto {
  @ApiProperty({ description: '주문 ID', example: 1 })
  orderId: number;

  @ApiProperty({ description: '상품 ID', example: 1 })
  cropId: number;

  @ApiProperty({ description: '주문 유형', example: 'buy' })
  orderType: OrderType;

  @ApiProperty({ description: '가격', example: 50 })
  price: number;

  @ApiProperty({ description: '미체결 수량', example: 100 })
  unfilledQuantity: number;

  @ApiProperty({ description: '주문 시간', example: new Date() })
  time: Date;
}
