import { DatabaseService } from '../database/database.service';
import { Injectable } from '@nestjs/common';
import { AccountCashDto } from './dto/accountCash.dto';
import { OrderType } from '../order/enums/orderType';

@Injectable()
export class AccountRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async getCashFromMemberId(memberId: number): Promise<AccountCashDto> {
    const query = `
      SELECT available_cash, pending_cash, total_cash
      FROM members
      WHERE member_id = $1
    `;

    const values = [memberId];

    const result = await this.databaseService.query(query, values);
    return {
      memberId: memberId,
      availableCash: result.rows[0].available_cash,
      pendingCash: result.rows[0].pending_cash,
      totalCash: result.rows[0].total_cash
    };
  }

  async updateCashByPlacingOrder(
    orderType: OrderType,
    memberId: number,
    total_price: number
  ): Promise<void> {
    if (total_price <= 0) {
      throw new Error('주문 금액은 0보다 커야 합니다.');
    }

    const query = `
      UPDATE members
      SET available_cash = available_cash - $1,
          pending_cash   = pending_cash + $1
      WHERE member_id = $2
    `;

    const values = [total_price, memberId];
    await this.databaseService.query(query, values);
  }

  async updateCashByCompletingOrder(
    orderType: OrderType,
    memberId: number,
    total_price: number
  ): Promise<void> {
    let query = ``;
    if (orderType === OrderType.BUY) {
      query = `
        UPDATE members
        SET pending_cash = pending_cash - $1
        WHERE member_id = $2
      `;
    } else if (orderType === OrderType.SELL) {
      query = `
        UPDATE members
        SET available_cash = available_cash + $1
        WHERE member_id = $2
      `;
    }

    const values = [total_price, memberId];
    await this.databaseService.query(query, values);
  }
}
