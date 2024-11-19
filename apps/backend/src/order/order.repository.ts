import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { OrderDto } from './dto/order.dto';
import { OrderStatus } from './enums/orderType';

@Injectable()
export class OrderRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async saveOrder(order: OrderDto): Promise<number> {
    const query = `
            INSERT INTO orders (crop_id,
                                member_id,
                                order_type,
                                trading_type,
                                quantity,
                                price,
                                status,
                                filled_quantity,
                                unfilled_quantity,
                                time)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING order_id
        `;

    const values = [
      order.cropId,
      order.memberId,
      order.orderType,
      order.tradingType,
      order.quantity,
      order.price,
      order.status || OrderStatus.PENDING, // 기본값 설정
      order.filledQuantity || 0,
      order.unfilledQuantity || order.quantity,
      order.time || new Date()
    ];

    const result = await this.databaseService.query(query, values);
    return result.rows[0].order_id;
  }
}
