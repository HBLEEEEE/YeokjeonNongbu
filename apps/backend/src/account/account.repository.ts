import { DatabaseService } from '../database/database.service';
import { Injectable } from '@nestjs/common';
import { AccountCashDto } from './dto/accountCash.dto';

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
}
