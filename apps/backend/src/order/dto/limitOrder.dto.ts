import { ApiProperty } from '@nestjs/swagger';
import { BaseOrderDto } from './baseOrder.dto';

export class LimitOrderDto extends BaseOrderDto {
  @ApiProperty({ description: '주문 수량', example: 100 })
  quantity: number;

  @ApiProperty({ description: '주문 가격', example: 50 })
  price: number;
}
