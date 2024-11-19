import { ApiProperty } from '@nestjs/swagger';
import { BaseOrderDto } from './baseOrder.dto';
import { OrderStatus } from '../enums/orderType';

export class OrderDto extends BaseOrderDto {
  @ApiProperty({ description: '회원 번호', example: 15 })
  memberId: number;

  @ApiProperty({ description: '주문 상태', example: 'pending' })
  status: OrderStatus;

  @ApiProperty({ description: '주문 가격', example: 1500 })
  price: number;

  @ApiProperty({ description: '주문 시간', example: new Date() })
  time: Date;

  @ApiProperty({ description: '주문 수량', example: 100 })
  quantity: number;

  @ApiProperty({ description: '체결된 수량', example: 50 })
  filledQuantity: number;

  @ApiProperty({ description: '미체결 수량', example: 50 })
  unfilledQuantity: number;
}
