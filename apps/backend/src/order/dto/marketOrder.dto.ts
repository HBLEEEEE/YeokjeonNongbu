import { ApiProperty } from '@nestjs/swagger';
import { BaseOrderDto } from './baseOrder.dto';
import { IsInt } from 'class-validator';

export class MarketOrderDto extends BaseOrderDto {
  @ApiProperty({ description: '총 주문 금액', example: 50000 })
  @IsInt({ message: '총 주문 금액은 정수여야 합니다.' })
  totalAmount: number;

  @ApiProperty({ description: '주문 수량', example: 100 })
  @IsInt({ message: '수량은 정수여야 합니다.' })
  quantity: number | null;
}
